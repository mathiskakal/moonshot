// Performance Tracking Utilities
/*
interface OperationMetrics {
  operationId: string;
  operationType: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: any;
  error?: boolean;
}

export class PerformanceTracker {
  private operations: Map<string, OperationMetrics> = new Map();
  private completedOperations: OperationMetrics[] = [];
  private operationCounter = 0;

  startOperation(operationType: string, metadata?: any): string {
    const operationId = `${operationType}_${++this.operationCounter}_${Date.now()}`;
    
    const operation: OperationMetrics = {
      operationId,
      operationType,
      startTime: Date.now(),
      metadata
    };
    
    this.operations.set(operationId, operation);
    return operationId;
  }

  endOperation(operationId: string, metadata?: any): void {
    const operation = this.operations.get(operationId);
    if (!operation) {
      console.warn(`Operation ${operationId} not found`);
      return;
    }

    const endTime = Date.now();
    const duration = endTime - operation.startTime;

    const completedOperation: OperationMetrics = {
      ...operation,
      endTime,
      duration,
      metadata: { ...operation.metadata, ...metadata }
    };

    this.completedOperations.push(completedOperation);
    this.operations.delete(operationId);

    // Log slow operations
    this.logSlowOperation(completedOperation);
  }

  private logSlowOperation(operation: OperationMetrics): void {
    const { duration = 0, operationType, metadata } = operation;
    
    if (duration > 300) {
      console.warn(`🐌 Very slow operation: ${operationType} took ${duration}ms`, metadata);
    } else if (duration > 150) {
      console.log(`⚠️ Slow operation: ${operationType} took ${duration}ms`);
    }

    // Recommend worker threads for heavy operations
    if (duration > 200 && metadata?.rowCount > 1000) {
      console.log(`💡 Consider using worker threads for ${operationType} with ${metadata.rowCount} rows`);
    }
  }

  getStats() {
    const stats = {
      totalOperations: this.completedOperations.length,
      averageDuration: 0,
      slowOperations: 0,
      verySlowOperations: 0,
      byType: {} as Record<string, { count: number; avgDuration: number; totalDuration: number }>
    };

    if (this.completedOperations.length === 0) {
      return stats;
    }

    let totalDuration = 0;
    const typeStats: Record<string, { durations: number[]; total: number }> = {};

    for (const op of this.completedOperations) {
      const duration = op.duration || 0;
      totalDuration += duration;

      if (duration > 150) stats.slowOperations++;
      if (duration > 300) stats.verySlowOperations++;

      if (!typeStats[op.operationType]) {
        typeStats[op.operationType] = { durations: [], total: 0 };
      }
      typeStats[op.operationType].durations.push(duration);
      typeStats[op.operationType].total += duration;
    }

    stats.averageDuration = Math.round(totalDuration / this.completedOperations.length);

    // Calculate stats by type
    for (const [type, data] of Object.entries(typeStats)) {
      stats.byType[type] = {
        count: data.durations.length,
        totalDuration: data.total,
        avgDuration: Math.round(data.total / data.durations.length)
      };
    }

    return stats;
  }

  clearStats(): void {
    this.completedOperations = [];
    this.operations.clear();
    this.operationCounter = 0;
  }
}
*/