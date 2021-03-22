# Get User With id

Get the details of a certain user

**URL** : `/user/:id`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

For a User with ID 5fcd1db6ac6f0461999234c9 on the local database where that User has saved an
email address and name information.

```json
{
    "_id": "5fcd1db6ac6f0461999234c9",
    "githubId": "764892387",
    "name": "John Doe",
    "email": "joe25@example.com",
    "username": "joe",
    "avatarUrl": "https://avatars3.githubusercontent.com/u/46683086?v=4",
    "admin": true
}
```

## Failure Responses

**Code** : `400 Bad Request`

Returned when the id in the parameters is invalid (wrong type).

**Code** : `404 Not Found`

Returned when no such user exists.

# Get All Users in Alphabetical Order (w/ Pagination)

Get the details of a certain user

**URL** : `/user/all?page={},per={}`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

The default page number is 1 and the default number of users per page is 5.

## Success Response

**Code** : `200 OK`

**Content examples**


```json
{
    "users":
        [
            {
                ...
            },
            {
                ...
            }
        ],
    "paginator": {
        "itemCount": 2,
        "perPage": 5,
        "pageCount": 1,
        "currentPage": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prev": null,
        "next": null
    }
}
```

# Log In OR Create New Account w/ GitHub (automatically)

TODO

**URL** : `...`

**Method** : `...`

**Auth required** : None

**Permissions required** : None

## Success Response

**Code** : `...`

**Content examples**

```json
{
    
}
```

## Failure Responses

**Code** : `...`

...

**Code** : `...`

...

## Notes

* Status code 500 is returned when the server throws a runtime error.