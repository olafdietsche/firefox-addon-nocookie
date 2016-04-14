# Firefox addon NoCookie

NoCookie is a Firefox addon for managing cookies.

It is sort of a shortcut to the Privacy/Cookie/Exceptions preferences.
You must choose "Use custom settings for history" in the privacy
settings and then decide, if you want to allow or block cookies by
default.

Now you can choose, wether to allow or block cookies for a site or
keep the default setting through the NoCookie dropdown menu.

## Test

I have built this with the Mozilla Add-on SDK. To run it in a test
browser, say

    jpm run

or

    jpm run -b /usr/bin/firefox

## Build

To build a package `nocookie.xpi`, run

    jpm xpi

## LICENSE

MPL-2.0
