FROM mongo

COPY archiveDictionaryDefinition.agz /archiveDictionaryDefinition.agz
COPY archiveDictionaryWordDefinitionList.agz /archiveDictionaryWordDefinitionList.agz
COPY archiveSearchStat.agz /archiveSearchStat.agz

RUN sleep 5
CMD mongorestore --host mongodb --drop --gzip --archive=/archiveDictionaryDefinition.agz --db=assyrian --collection=DictionaryDefinition ; mongorestore --host mongodb --drop --gzip --archive=/archiveDictionaryWordDefinitionList.agz --db=assyrian --collection=DictionaryWordDefinitionList ; mongorestore --host mongodb --drop --gzip --archive=/archiveSearchStat.agz --db=assyrian --collection=SearchStat