# **LIRI**
##### is a ancronym for **L**anguage **I**nterpretation and **R**ecognition **I**nterface.
##### It is a node.js application that runs commands interfaces with multiple APIs.

### Command line is as follows:
## **node liri _command_ _parameter_**
#####	where *command* is one of the following:
####		* my-tweets
#####				*parameter* specifies number of tweets to return (defaults to '20')
####		* spotify-this-song
#####				*parameter* specifies the song to search for (defaults to 'Rapid Roy' by Jim Croce)
####		* movie-this
#####				*parameter* specifies the movie to lookup (defaults to '2001: A Space Odyssey')
####		* do-what-it-says
#####				*parameter* specifies a command files containing additional Command/Parameter object pairs					(defaults to 'random.txt')

### _Notes:_

##### Command files must be structured as follows:
#### [	{"Action":"spotify-this-song",	"Value":"Rapid Roy"},
#### 	{"Action":"movie-this",			"Value":"Circle of Iron"},
#### 	{"Action":"do-what-it-says",	"Value":"Random.txt"},
#### 	{"Action":"my-tweets",			"Value":"10"}		]

##### To prevent infinite looping, do-what-it-says commands will not run command files that have already been executed in current process loop.