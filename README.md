# Firefox addon NoCookie

NoCookie is a Firefox addon for managing cookies.

You must choose "Use custom settings for history" in the privacy
settings and then decide, if you want to allow or block cookies by
default.

Now you can choose, wether to allow or block cookies for a site or
keep the default setting.

## Test

I have built this with the Mozilla Add-on SDK. To run it in a test
browser, say

    cfx run

## Build

To build a package `nocookie.xpi`, run

    cfx xpi

## Debian package

Building a Debian package is a bit more involved. You need a few
developer packages

    apt-get install debhelper cdbs mozilla-devscripts

Then, you must first build an xpi package as above and extract it in a
new directory.

    mkdir nocookie
    cd nocookie
    unzip /path/to/nocookie.xpi

Copy the `debian` subdirectory and build the Debian package

    cp -a /path/to/nocookie.src/debian .
    dpkg-buildpackage -uc -us -sd -tc

This creates an unsigned package
`xul-ext-nocookie_0.20151221_all.deb`, which can be installed on a
Debian or Ubuntu system.

## LICENSE

MPL-2.0
