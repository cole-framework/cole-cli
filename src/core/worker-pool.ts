import { Worker } from "worker_threads";

export class WorkerPool {
  private availableWorkers: Worker[] = [];
  private workers: Worker[] = [];
  private taskQueue = [];
  private onTaskComplete = null;
  private onTaskError = null;

  constructor(
    public readonly workerPath: string,
    public readonly numWorkers: number
  ) {
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerPath);
      worker.on("error", (err) => this.onWorkerError(worker, err));
      worker.on("exit", (code) => this.onWorkerExit(worker, code));
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  executeTask(data: any) {
    return new Promise((resolve, reject) => {
      if (this.availableWorkers.length === 0) {
        reject(new Error("No available workers"));
        return;
      }

      const worker = this.availableWorkers.pop();
      worker.once("message", (result) => {
        this.availableWorkers.push(worker);
        resolve(result);
      });
      worker.postMessage(data);
    });
  }

  setTaskCompleteCallback(callback) {
    this.onTaskComplete = callback;
  }

  setTaskErrorCallback(callback) {
    this.onTaskError = callback;
  }

  shutdown() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }

  private checkQueue() {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const { taskData, resolve, reject } = this.taskQueue.shift();
      const worker = this.availableWorkers.pop();
      worker.once("message", (result) => {
        this.availableWorkers.push(worker);
        if (this.onTaskComplete) {
          this.onTaskComplete(result, worker);
        }
        resolve(result);
        this.checkQueue();
      });
      worker.once("error", (error) => {
        if (this.onTaskError) {
          this.onTaskError(error, worker);
        }
        reject(error);
        this.checkQueue();
      });
      worker.postMessage(taskData);
    }
  }

  private onWorkerError(worker: Worker, error: Error) {
    console.error(`Worker ${worker.threadId} encountered error:`, error);
    this.removeWorker(worker);
  }

  private onWorkerExit(worker: Worker, code) {
    console.log(`Worker ${worker.threadId} stopped with exit code ${code}`);
    this.removeWorker(worker);
  }

  private removeWorker(worker: Worker) {
    this.workers = this.workers.filter((w) => w !== worker);
    this.availableWorkers = this.availableWorkers.filter((w) => w !== worker);
  }
}
