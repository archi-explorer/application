"use-strict";


/**
 * 
 * PARTIE DIRECTORY DROP
 * 
 */


/**
 * Ouverture des directories et lecture des fichiers
 */

export function GetFilesFromDataTransfer (dataTransfer, isRecursiveFile, onReady)
{
    async function GetFileEntriesFromDirectory (dirEntry, fileEntries)
    {
        let reader = dirEntry.createReader ();
        return new Promise ((resolve, reject) => {
            reader.readEntries (
                async (dirEntries) => {
                    for (let entry of dirEntries) {
                        if (entry.isFile) {
                            fileEntries.push (entry);
                        } else if (entry.isDirectory) {
                            await GetFileEntriesFromDirectory (entry, fileEntries);
                        }
                    }
                    resolve ();
                },
                (error) => {
                    reject (error);
                }
            );
        });
    }


    async function GetFileObjectsFromEntries (entries, onReady)
    {
        let fileEntries = [];
        for (let entry of entries) {
            if (entry.isFile) {
                fileEntries.push (entry);
            } else if (entry.isDirectory) {
                await GetFileEntriesFromDirectory (entry, fileEntries);
            }
        }

        let fileObjects = await Promise.all (fileEntries.map ((fileEntry) => {
            return new Promise ((resolve, reject) => {
                fileEntry.file (
                    (file) => {
                        resolve (file);
                    },
                    (error) => {
                        reject (error);
                    }
                );
            });
        }));
        onReady (fileObjects);
    }

    let getAsEntryFunc = null;
    if (DataTransferItem) {
        if (DataTransferItem.prototype.getAsEntry) {
            getAsEntryFunc = DataTransferItem.prototype.getAsEntry;
        } else if (DataTransferItem.prototype.webkitGetAsEntry) {
            getAsEntryFunc = DataTransferItem.prototype.webkitGetAsEntry;
        }
    }

    if (getAsEntryFunc !== null) {
        let entries = [];
        for (let item of dataTransfer.items) {
            let entry = getAsEntryFunc.call (item);
            if (entry !== null) {
                entries.push (entry);
            }
        }
        if(isRecursiveFile){
            GetFileObjectsFromEntries (entries, (allEntries) => {
                onReady (allEntries);
            });
        }
        else if(!isRecursiveFile){
            GetDirectoryObjectsFromEntries (entries, (allEntries) => {
                onReady (allEntries);
            });
        }
    } else {
        onReady (dataTransfer.files);
    }
}


export function printFiles(files)
{
    for (let file of files) {
        console.log("files, we print one : "+file.name);
        //console.log("files, we print their full relative path : "+file.webkitRelativePath);
    }
} 
