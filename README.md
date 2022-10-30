# Project

Bagaimana cara nampilin value key dari req.body pada joins.rest!

## dari yang ini:
```bash
{
    "id": 1,
    "storages": 1,
    "items": [1, 2]
},
```
## jadi,
```bash
{
    "id": 1,
    "storages": 
        {
            "id": 1,
            "nama": "Kardus A" 
        }
    "items": [
        {
            "id": 1,
            "nama": "Pensil"
        },
        {
            "id": 2,
            "nama": "Pulpen"
        },
    ]
},
```