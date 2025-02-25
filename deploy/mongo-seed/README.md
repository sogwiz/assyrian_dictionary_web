The agz files are generated via Studio 3T -> Export Collection -> mongodump -> bson mongodump archive (enable compression)

# To generate an archive file that can be used to seed the docker mongodb container with data
mongodump --host="host:port" --username="username" --password="passwd" --db="assyrian" --collection="DictionaryDefinition" --archive="/Users/username/pathToFile.agz" --gzip