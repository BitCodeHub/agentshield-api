// Type definitions for AgentShield API

export interface Agent {
  id: string;
  name: string;
  description?: string;
  platform?: string;
  version?: string;
  status: AgentStatus;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
  boundAt?: Date;
  metadata?: Record<string, any>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;
}

export type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REVOKED';

export interface CreateAgentInput {
  name: string;
  description?: string;
  platform?: string;
  version?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface BindOwnerInput {
  ownerId?: string;
  ownerEmail: string;
  ownerName?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
