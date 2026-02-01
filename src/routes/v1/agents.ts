import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createAgentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  platform: z.string().optional(),
  version: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional()
});

const bindOwnerSchema = z.object({
  ownerId: z.string().uuid().optional(),
  ownerEmail: z.string().email(),
  ownerName: z.string().optional()
});

// POST /v1/agents - Register a new agent
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createAgentSchema.parse(req.body);
    
    const agent = await prisma.agent.create({
      data: {
        id: uuidv4(),
        name: validatedData.name,
        description: validatedData.description,
        platform: validatedData.platform,
        version: validatedData.version,
        metadata: validatedData.metadata,
        tags: validatedData.tags || [],
        status: 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.errors
      });
      return;
    }
    next(error);
  }
});

// GET /v1/agents - List all agents
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, ownerId, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        take: Math.min(parseInt(limit as string), 100),
        skip: parseInt(offset as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.agent.count({ where })
    ]);

    res.json({
      success: true,
      data: agents,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /v1/agents/:id - Get agent by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        policies: true,
        _count: {
          select: { auditLogs: true }
        }
      }
    });

    if (!agent) {
      res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
      return;
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
});

// POST /v1/agents/:id/owner - Bind human owner to agent
router.post('/:id/owner', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = bindOwnerSchema.parse(req.body);

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({ where: { id } });
    if (!existingAgent) {
      res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
      return;
    }

    // Update agent with owner binding
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        ownerId: validatedData.ownerId || uuidv4(),
        ownerEmail: validatedData.ownerEmail,
        ownerName: validatedData.ownerName,
        boundAt: new Date()
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        agentId: id,
        action: 'owner.bind',
        resource: validatedData.ownerEmail,
        outcome: 'allowed',
        metadata: {
          ownerId: agent.ownerId,
          ownerEmail: agent.ownerEmail,
          ownerName: agent.ownerName
        }
      }
    });

    res.json({
      success: true,
      data: agent,
      message: `Agent "${agent.name}" bound to owner ${validatedData.ownerEmail}`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.errors
      });
      return;
    }
    next(error);
  }
});

export default router;
