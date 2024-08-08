class DatabaseService {
    async saveOperation(operation) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
  
    async getSavedOperations() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([
                    
                ]);
            }, 1000);
        });
    }
}
  
module.exports = DatabaseService;
  