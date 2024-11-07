import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import { Debugging_ON } from '../config/config.js';


//Connecting to Cloud Storage
const storage = new Storage({
    projectId: 'blue-ocean-bgv',
    keyFilename: './config/blue-ocean-bgv-8c94d1c357e1.json'
})

const bucket = storage.bucket(process.env.BUCKET_NAME);

const googlecloud = {

    upload: async (file, user, type) => {
        if(Debugging_ON) console.log('googlecloud.upload()', file);
        const uploadedFile = { status: false }
        
        //Validating Input
        if(!file) {
            uploadedFile.message = 'Invalid CLient Response, No File In Header';
            uploadedFile.error = 'NOFILE';
        } else {
            const fileType = file.originalname.split('.');
            const Filename = `${user}_${type}_${Date.now()}.${fileType[fileType.length - 1]}`;
            if(Debugging_ON) console.log('googlecloud.upload().Filename -> ', Filename);

            //Converting to BLOB
            return new Promise((resolve, reject) => {
                // Convert to BLOB
                const BLOB = bucket.file(Filename);
                const BLOB_Stream = BLOB.createWriteStream({ metadata: { contentType: file.mimetype } });
          
                // Handle errors
                BLOB_Stream.on('error', (err) => {
                  console.log(`${uploadedFile.message = 'Failed To Upload User Image'}. Error:\n`, err);
                  uploadedFile.error = 'GOOGLECONNERR';
                  reject(uploadedFile); // Reject the promise with the error
                });

                // Handle success (when the upload finishes)
                BLOB_Stream.on('finish', () => {
                  uploadedFile.message = 'User Image Uploaded';
                  uploadedFile.image = `gs://${bucket.name}/${Filename}`;
                  uploadedFile.imageName = Filename;
                  uploadedFile.status = true;
                  resolve(uploadedFile); // Resolve the promise with the uploaded file info
                });
          
                // End the stream, which starts the upload process
                BLOB_Stream.end(file.buffer);
              });
            }

            // const BLOB = bucket.file(Filename);
            // const BLOB_Stream = BLOB.createWriteStream({ metadata:{ contentType: file.mimetype } });

            // BLOB_Stream.on('error', (err) => { console.log(`${uploadedFile.message = 'Failed To Upload User Image'}. Error:\n`, err, uploadedFile.error = 'GOOGLECONNERR') })

            // BLOB_Stream.on('finish', () => { 
            //     uploadedFile.message = 'User Image Uploaded';
            //     uploadedFile.image = `gs://${bucket.name}/${Filename}`;
            //     uploadedFile.status = true;
            // })
            
            // BLOB_Stream.end(file.buffer);
        // }
    },

    generateURL: (file) => {
        if(Debugging_ON) console.log('googlecloud.generateURL()', file);
        const userFileURL = { status: false };
        
        return new Promise(async (resolve, reject) => {
            // Convert to BLOB
            const BLOB = bucket.file(file);

            const [exists] = await BLOB.exists();
            if(!exists) userFileURL.message = `File ${file} Does Not Exist On Server`;
            else {
                userFileURL.signedURL = await BLOB.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 3 * 60 * 60 * 1000
                })

                if(!userFileURL.signedURL){
                    userFileURL.message = 'Failed To Generate Signed URL';
                    reject(userFileURL)
                } else {
                    userFileURL.status = true;
                    userFileURL.message = 'URL Generated Successfully';
                    resolve(userFileURL);
                }
            }
        });
    },

    delete: async (fileName) => {
        if(Debugging_ON) console.log('googlecloud.delete()', fileName)
        const deletedFiles = { status: false },
            [files] = await bucket.getFiles(),
            filesToDelete = files.filter((file) => file.name.includes(fileName));
        if(Debugging_ON) console.log('googlecloud.delete().filesToDelete -> ', filesToDelete, filesToDelete.length);
        
        if(filesToDelete.length === 0) deletedFiles.message = `No Files Found With File Name ${fileName}`;
        else {
            return new Promise(async (res, rej) => {
                for(let file of filesToDelete) { await file.delete().then(() => { if(Debugging_ON) console.log(`${file.fileName} Deleted`) }).catch((err) => { console.log(`${ deletedFiles = `Unable To Delete File ${file}`}`, `${deletedFiles.error = err}`); rej(deletedFiles) }) }
                deletedFiles.message = `All Files with ${fileName} Deleted`;
                deletedFiles.status = true;
                res(deletedFiles);
            })
        }
        return (deletedFiles)
    },

    update: async (file, user, type) => {
        if(Debugging_ON) console.log('googlecloud.update()', '\nFile -> ', file, '\nUser -> ', user, '\nType -> ', type);
        const updatedFiles = { status: false },
            [files] = await bucket.getFiles(),
            filesToUpdate = files.filter((file) => file.name.includes(`${user}_${type}`));
        
        for(let file of filesToUpdate) await file.delete().then(() => {if(Debugging_ON) console.log(`${file.fileName} Deleted`)}).catch((err) => { console.log(`${ deletedFiles = `Unable To Delete File ${file}`}`, `${deletedFiles.error = err}`)})

        return new Promise(async (res, rej) => {
            const fileType = file.originalname.split('.');
            const Filename = `${user}_${type}_${Date.now()}.${fileType[fileType.length - 1]}`;
            if(Debugging_ON) console.log('googlecloud.update().Filename -> ', Filename);
            
            // Convert to BLOB
            const BLOB = bucket.file(Filename);
            const BLOB_Stream = BLOB.createWriteStream({ metadata: { contentType: file.mimetype } });
    
            // Handle errors
            BLOB_Stream.on('error', (err) => {
            console.log(`${updatedFiles.message = 'Failed To Upload User Image'}. Error:\n`, err);
            updatedFiles.error = 'GOOGLECONNERR';
            rej(updatedFiles); // Reject the promise with the error
            });

            // Handle success (when the upload finishes)
            BLOB_Stream.on('finish', () => {
                if(Debugging_ON) console.log('File Upload Finished')
                updatedFiles.message = 'User Image Uploaded';
                updatedFiles.image = `gs://${bucket.name}/${Filename}`;
                updatedFiles.imageName = Filename;
                updatedFiles.status = true;
                res(updatedFiles); // Resolve the promise with the uploaded file info
            });
    
            // End the stream, which starts the upload process
            BLOB_Stream.end(file.buffer);
        })
    }
}

export default googlecloud