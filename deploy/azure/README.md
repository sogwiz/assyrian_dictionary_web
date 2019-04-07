###Docker 
Example via Azure Container Instances ACI
```
az container create \
    --resource-group Default-Web-WestUS2 \
    --name mycontainer3 \
    --image sogwiz/sargonsays \
    --restart-policy Always \
    --port 80 \
    --environment-variables 'DB_CONN_STRING'='DB_CONN_STRING' 'REACT_PARSE_APP_ID'='REACT_PARSE_APP_ID' 'REACT_PARSE_JS_KEY'='REACT_PARSE_JS_KEY' 'REACT_PARSE_SERVER'='https://REACT_PARSE_SERVER' 'WEBSITES_PORT'=3001
```

Example ACI deploy via yaml file
```
az container create --resource-group Default-Web-WestUS2 --file sargonsays.yaml 
```