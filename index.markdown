---
layout: echogolem
---

# echo-golem

`echo-golem` is a project to demonstrate the ease of use and deployment for
[source-to-image](https://github.com/openshift/source-to-image) based
applications on the OpenShift platform. When running it provides a simple
HTTP interface that will echo any text based message that is sent.

## OpenShift deployment

The simplest deployment method is to use the `new-app` command in the
OpenShift client. While logged in to a cluster, issue the following command:

```
$ oc new-app centos/nodejs-4-centos7~https://github.com/elmiko/echo-golem
```

This will instruct OpenShift to create a build configuration, imagestream,
deployment configuration and service for the application in the
[`https://github.com/elmiko/echo-golem`](https://github.com/elmiko/echo-golem)
repository using the
[`centos/nodejs-4-centos7`](https://hub.docker.com/r/centos/nodejs-4-centos7/)
image from the Docker registry as it's base for construction.

Assuming that command is successful, you should see some output akin to this:

```
-> Found Docker image 8438a41 (2 weeks old) from Docker Hub for "centos/nodejs-4-centos7"

    Node.js 4 
    --------- 
    Platform for building and running Node.js 4 applications

    Tags: builder, nodejs, nodejs4

    * An image stream will be created as "nodejs-4-centos7:latest" that will track the source image
    * A source build using source code from https://github.com/elmiko/echo-golem will be created
      * The resulting image will be pushed to image stream "echo-golem:latest"
      * Every time "nodejs-4-centos7:latest" changes a new build will be triggered
    * This image will be deployed in deployment config "echo-golem"
    * Port 8080/tcp will be load balanced by service "echo-golem"
    * Other containers can access this service through the hostname "echo-golem"

--> Creating resources ...
    imagestream "nodejs-4-centos7" created
    imagestream "echo-golem" created
    buildconfig "echo-golem" created
    deploymentconfig "echo-golem" created
    service "echo-golem" created
--> Success
    Build scheduled, use 'oc logs -f bc/echo-golem' to track its progress.
    Run 'oc status' to view your app.
```

At this point, the application should be running and we only need to expose
a route to its service to confirm this by POSTing a message to it. To
configure access to the application, it is now necessary to create a route
with the system. I know the IP address of my edge router and will use that
as the route of my new hostname.

*a note about the usage of xip.io here, xip is a service that will provide
a transparent DNS resolution based on the IP address specified in the
hostname*

```
$ oc expose service echo-golem --hostname echo.10.0.1.109.xip.io
route "echo-golem" exposed
```

Finally, a test POST to the address `http://echo.10.0.1.109.xip.io` should
confirm that our server is running.

```
$ curl http://echo.10.0.1.109.xip.io --data "Hello World!"
Hello World!
```

## Local source-to-image deployment

The echo-golem can also be tested locally by creating a Docker image and
running it from the command line. To create the Docker image, you will need
to use the
[source-to-image project](https://github.com/openshift/source-to-image) by
executing the following command:

```
$ s2i build git://github.com/elmiko/echo-golem centos/nodejs-4-centos7 echo-golem
```

This command will generate the image and place it in your local Docker
registry with the name `echo-golem`. With the image built, you can now run
through Docker with the following command:

```
docker run --rm -it -p 8080:8080 echo-golem
```

Now the echo-golem is listening on your localhost at port 8080, you can test
this with a similar curl command as before.

```
$ curl http://localhost:8080 --data "Hello World!"
Hello World!
```
