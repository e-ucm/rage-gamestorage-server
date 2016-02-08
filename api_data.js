define({ "api": [
  {
    "type": "get",
    "url": "/health",
    "title": "Check the api health.",
    "name": "Heath",
    "group": "Health",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"Available\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/health.js",
    "groupTitle": "Health"
  },
  {
    "type": "delete",
    "url": "/usermodel/:prefix/:suffix",
    "title": "Deletes an existing document.",
    "description": "<p>If they key is not available an error message is returned and nothing is deleted.</p>",
    "name": "DeleteUsermodel",
    "group": "Usermodel",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prefix",
            "description": "<p>A string used as prefix to build the key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suffix",
            "description": "<p>A string used as suffix to build the key. The document's key is built such as: 'prefix' + '|' + 'suffix'.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"message\": \"Success.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/gamestorage.js",
    "groupTitle": "Usermodel"
  },
  {
    "type": "get",
    "url": "/usermodel/:prefix/:suffix",
    "title": "Returns a document value assigned to the constructed key.",
    "description": "<p>If a document with a given key is not available an error message is returned.</p> <pre><code>     The key is constructed using the values of 'prefix' &amp; 'suffix'       The generation process appends 'prefix' + '|' + 'suffix' to create the key.       NOTE: '|' is a special character that cannot be present in the prefix nor the suffix.       The prefix/suffix mechanism is used to be able to easily filter documents with the same identifier      used by different assets.      For instance, is assets 'A' and 'B' want to use a document identified by the key 'key'      and each document has to be different, they can use the prefix/suffix with the following values:           Asset A:              prefix: 'A'              suffix: 'key'          Asset B:              prefix: 'B'              suffix: 'key'</code></pre>",
    "name": "GetUsermodel",
    "group": "Usermodel",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prefix",
            "description": "<p>A string used as prefix to build the key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suffix",
            "description": "<p>A string used as suffix to build the key. The document's key is built such as: 'prefix' + '|' + 'suffix'.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        <VALUE_DOCUMENT>\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/gamestorage.js",
    "groupTitle": "Usermodel"
  },
  {
    "type": "post",
    "url": "/usermodel/:prefix/:suffix",
    "title": "Creates a new document.",
    "description": "<p>If they key already has an assigned value an error is returned.</p>",
    "name": "PostUsermodel",
    "group": "Usermodel",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prefix",
            "description": "<p>A string used as prefix to build the key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suffix",
            "description": "<p>A string used as suffix to build the key. The document's key is built such as: 'prefix' + '|' + 'suffix'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    <VALUE_DOCUMENT>\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-gleaner-user.",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"message\": \"Success.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/gamestorage.js",
    "groupTitle": "Usermodel"
  },
  {
    "type": "post",
    "url": "/usermodel/update/:prefix/:suffix/",
    "title": "Updates the fields of an existing document.",
    "description": "<p>If they key is not available an error is thrown.</p>",
    "name": "PostUsermodelField",
    "group": "Usermodel",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prefix",
            "description": "<p>A string used as prefix to build the key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suffix",
            "description": "<p>A string used as suffix to build the key. The document's key is built such as: 'prefix' + '|' + 'suffix'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fields",
            "description": "<p>The fields to be updated. Dot notation is supported. More information at: https://docs.mongodb.org/manual/core/document/#document-dot-notation If the fields does not exist, new fields will be added with the specified value, provided that the new fields does not violate a type constraint. If you specify a dotted path for a non-existent field, the embedded documents will be created as needed to fulfill the dotted path to the field.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    <field1>: <value1>,\n    <field2>: <value2>,\n    ...\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-gleaner-user.",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"message\": \"Success.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "DocumentNotFound",
            "description": "<p>No document found!</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/gamestorage.js",
    "groupTitle": "Usermodel"
  },
  {
    "type": "put",
    "url": "/usermodel/:prefix/:suffix",
    "title": "Overrides or creates a new document.",
    "description": "<ul> <li>If a document with the given key is not available a new document is created. - If a document with the given key already exists all its values are overridden by the new values provided within the body of this PUT request.</li> </ul>",
    "name": "PutUsermodel",
    "group": "Usermodel",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prefix",
            "description": "<p>A string used as prefix to build the key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "suffix",
            "description": "<p>A string used as suffix to build the key. The document's key is built such as: 'prefix' + '|' + 'suffix'.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    <VALUE_DOCUMENT>\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-gleaner-user.",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"message\": \"Success.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/gamestorage.js",
    "groupTitle": "Usermodel"
  }
] });
