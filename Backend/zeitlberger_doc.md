![alt text](image.png)


fix:
 - docker stop $(docker ps -aq)
 - docker rm $(docker ps -aq)
 - docker volume rm $(docker volume ls -q)