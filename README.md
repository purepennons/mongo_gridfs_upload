# Usage
1. start a mongoDB service
2. change `config/config.json`
3. 
```
git clone https://github.com/purepennons/mongo_gridfs_upload.git
cd mongo_gridfs_upload & npm install
npm start
```
# APIs
* `POST-> /files`: upload a file. format: multipart/form-data
* `GET-> /files/:fileId`: download a file by id.
