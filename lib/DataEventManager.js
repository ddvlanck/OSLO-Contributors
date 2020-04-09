let listeners = new Map();
let fileCounter = 0;
let chunksProcessed = 0;
let lastChunkSend = false;

class DataEventManager {

    subscribe(label, callback) {
        listeners.has(label) || listeners.set(label, []);
        listeners.get(label).push(callback);
    }

    push(label, ...args) {
        let ls = listeners.get(label);

        if (ls && ls.length) {
            ls.forEach((callback) => {
                callback(...args);
            });
            return true;
        }
        return false;
    }

    /*
    * We need extra methods because the last file value can arrive earlier
    * than the interface has processed all chunks
    * Only when all chunks are processed and last file event was received, then we start computing
    * */

    // This method is used by the interface to show he is done processing the chunk
    ready(){
        chunksProcessed++;

        if(lastChunkSend){
            this._checkToStartProcessing();
        }

    }

    lastChunkSend(numberOfFiles){
        fileCounter = numberOfFiles;
        lastChunkSend = true;
    }

    _checkToStartProcessing(){
        if(chunksProcessed === fileCounter){
            this.push('end', '')
        }
    }
}

module.exports = new DataEventManager;
