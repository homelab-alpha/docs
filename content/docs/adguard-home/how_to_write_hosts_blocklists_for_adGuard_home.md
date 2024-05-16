---
title: "How to write hosts blocklists for AdGuard Home"
description:
   "Learn how to write hosts blocklists for AdGuard Home using Adblock-style
   syntax for /etc/hosts, or domains-only syntax. Create effective
   blocklists compatible with browser ad blockers and AdGuard Home."
url: "adguard-home/how-to-write-hosts-blocklists"
icon: "list_alt_add"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - AdGuard Home
series:
  - AdGuard Home
tags:
  - AdGuard Home
  - blocklists
  - hostlists
  - Adblock syntax
  - /etc/hosts syntax
  - domains-only syntax
  - DNS filtering
keywords:
  - AdGuard Home blocklists
  - writing blocklists
  - Adblock-style syntax
  - /etc/hosts syntax
  - domains-only syntax
  - hosts blocklists
  - DNS filtering

weight: 1003

toc: true
katex: true
---

<br />

{{% alert context="warning" %}}
**Caution** - This documentation is in progress
{{% /alert %}}

{{% alert context="primary" %}}
[Official: Documentation for write hosts blocklists]
{{% /alert %}}

<br />

## Introduction

There are three different approaches to writing hosts blocklists:

- [Adblock-style syntax](#adblock-style-syntax): the modern approach to writing
  filtering rules based on using a subset of the Adblock-style rule syntax. This
  way blocklists are compatible with browser ad blockers.

- [`/etc/hosts` syntax](#hosts-style-syntax): the old, tried-and-true approach that uses
  the same syntax that operating systems do for their hosts files.

- [Domains-only syntax](#domains-only-syntax): a simple list of domain names.

If you are creating a blocklist for AdGuard Home, we recommend using the
[Adblock-style syntax](#adblock-style-syntax).\
It has a couple of important advantages over the old-style syntax:

- **Blocklists size.** Using pattern matching allows you to have a single rule
  instead of hundreds of `/etc/hosts` entries.

- **Compatibility.** Your blocklist will be compatible with browser ad blockers,
  and it will be easier to share rules with a browser filter list.

- **Extensibility.** For the last decade the Adblock-style syntax has greatly
  evolved, and we don't see why we can't extend it even more and provide
  additional features for network-wide blockers.

If you're maintaining an etc-hosts-style blocklist or if you maintain
multiple filter lists regardless of their type, we provide a tool that can be
used to compile blocklists for AdGuard Home. We called it [Hostlist compiler]
and we use it ourselves to create [AdGuard DNS filter].

<br />

## Basic examples

- `||example.org^`: block access to the `example.org` domain and all its
  subdomains, like `www.example.org`.

- `@@||example.org^`: unblock access to the `example.org` domain and all its
  subdomains.

- `1.2.3.4 example.org`: (attention, old `/etc/hosts`-style syntax) respond with
  `1.2.3.4` to queries for the `example.org` domain but **not** its subdomains.
  `www.example.org` remains allowed.

  Using the unspecified IP address (`0.0.0.0`) or a local address (`127.0.0.1`
  and alike) for a host is basically the same as blocking that host.

  ```adblock
  # Returns the IP address 1.2.3.4 for example.org.
  1.2.3.4 example.org
  # Blocks example.com by responding with 0.0.0.0.
  0.0.0.0 example.com
  ```

- `example.org`: a simple domain rule. Blocks `example.org` domain but **not**
  its subdomains. `www.example.org` remains allowed.

- `! Here goes a comment` and `# Also a comment`: comments.

- `/REGEX/`: block access to the domains matching the specified regular
  expression

<br />

## Adblock-style syntax

This is a subset of the [traditional Adblock-style] syntax which is used by
browser ad blockers.

```plaintext
     rule = ["@@"] pattern [ "$" modifiers ]
modifiers = [modifier0, modifier1[, ...[, modifierN]]]
```

- `pattern`: the hostname mask. Every hostname is matched against this mask. The
  pattern can also contain special characters, which are described below.

- `@@`: the marker that is used in the exception rules. Start your rule with
  this marker if you want to turn off filtering for the matching hostnames.

- `modifiers`: parameters that clarify the rule. They may limit the scope of the
  rule or even completely change the way it works.

<br />

## Special characters

- `*`: the wildcard character. It is used to represent any set of characters.
  This can also be an empty string or a string of any length.

- `||`: matches the beginning of a hostname, including any subdomain. For
  instance, `||example.org` matches `example.org` and `test.example.org` but not
  `testexample.org`.

- `^`: the separator character. Unlike browser ad blocking, there's nothing to
  separate in a hostname, so the only purpose of this character is to mark the
  end of the hostname.

- `|`: a pointer to the beginning or the end of the hostname. The value depends
  on the character placement in the mask. For example, the rule `ample.org|`
  corresponds to `example.org` but not to `example.org.com`. `|example`
  corresponds to `example.org` but not to `test.example`.

<br />

## Regular expressions

If you want even more flexibility in making rules, you can use [regular
expressions] instead of the default simplified matching syntax. If you want to
use a regular expression, the pattern has to look like this for example:

```plaintext
pattern = "/" regexp "/"
```

- `/example.*/` will block hosts matching the `example.*` regexp.

- `@@/example.*/$important` will unblock hosts matching the `example.*` regexp.

{{% alert context="primary" %}}
Note that this rule also implies the `important` modifier.
{{% /alert %}}

<br />

## Comments

Any line that starts with an exclamation mark or a hash sign is a comment and it
will be ignored by the filtering engine. Comments are usually placed above rules
and used to describe what a rule does for example:

```adblock
! This is a comment.
# This is also a comment.
```

<br />

## Rule modifiers

You can change the behavior of a rule by adding modifiers. Modifiers must be
located at the end of the rule after the `$` character and be separated by
commas.

{{% alert context="primary" %}}
Modifiers don't work with `/etc/hosts`-style rules.
For example, `127.0.0.1 example.org$badfilter` will **not** disable the original\
 `127.0.0.1 example.org` rule for example:
{{% /alert %}}

- ```adblock
    ||example.org^$important
  ```

  `||example.org^` is the matching pattern. `$` is the delimiter, which signals
  that the rest of the rule are modifiers. `important` is the modifier.

- You may want to use multiple modifiers in a rule. Separate them by commas in
  this case:

  ```adblock
  ||example.org^$client=127.0.0.1,dnstype=A
  ```

  `||example.org^` is the matching pattern. `$` is the delimiter, which signals
  that the rest of the rule are modifiers. `client=127.0.0.1` is the
  [`client`](#client) modifier with its value, `127.0.0.1`, is the delimiter.
  And finally, `dnstype=A` is the [`dnstype`](#dns-type) modifier with its value,
  `A`.

{{% alert context="primary" %}}
If a rule contains a modifier not listed in this document, the whole
rule **must be ignored**. This way we avoid false-positives when people are
trying to use unmodified browser ad blockers' filter lists like EasyList or
EasyPrivacy.
{{% /alert %}}

<br />

## Client

The `client` modifier allows specifying clients this rule is applied to. There
are two main ways to identify a client:

- By their IP address or CIDR prefix. This way works for all kinds of clients.

- By their name. This way only works for persistent clients, that is clients
  which you have manually added on the “Settings → Client settings” page.

{{% alert context="primary" %}}
ClientIDs are not currently supported, only names are. If you have added a
client with the name “My Client” and ClientID `my-client`, spell your modifier
as\
`$client='My Client'` as opposed to `$client=my-client`.
{{% /alert %}}

The syntax is:

```adblock
$client=value1|value2|...
```

You can also exclude clients by adding a `~` character before the value. In this
case, the rule is not be applied to this client's DNS requests.

```adblock
$client=~value1
```

Client names usually contain spaces or other special characters, which is why
you should enclose the name in quotes. Both single and double ASCII quotes are
supported. Use the backslash (`\`) to escape quotes (`"` and `'`), commas (`,`),
and pipes (`|`).

{{% alert context="primary" %}}
When excluding a client, you **must** keep `~` out of the quotes for example:
{{% /alert %}}

- `@@||*^$client=127.0.0.1`: unblock everything for localhost.

- `||example.org^$client='Frank\'s laptop'`: block `example.org` for the client
  named `Frank's laptop` only. Note that quote (`'`) in the name must be
  escaped.

- `||example.org^$client=~'Mary\'s\, John\'s\, and Boris\'s laptops'`: block
  `example.org` for everyone except for the client named
  `Mary's, John's, and Boris's laptops`. Note that comma (`,`) must be escaped
  as well.

- `||example.org^$client=~Mom|~Dad|Kids`: block `example.org` for `Kids`, but
  not for `Mom` and `Dad`. This example demonstrates how to specify multiple
  clients in one rule.

- `||example.org^$client=192.168.0.0/24`: block `example.org` for all clients
  with IP addresses in the range from `192.168.0.0` to `192.168.0.255`.

<br />

## DenyAllow

Available since **v0.106.0**.

You can use the `denyallow` modifier to exclude domains from the blocking rule.
To add multiple domains to one rule, use the `|` character as a separator.

The syntax is:

```adblock
$denyallow=domain1|domain2|...
```

This modifier allows avoiding creating unnecessary exception rules when our
blocking rule covers too many domains. You may want to block everything save for
a couple of TLD domains. You could use the standard approach, i.e. rules like
this:

```adblock
! Block everything.
/.*/

! Unblock a couple of TLDs.
@@||com^
@@||net^
```

The problem with this approach is that this way you will also unblock tracking
domains that are located on those TLDs (i.e. `google-analytics.com`). Here's how
to solve this with `denyallow` for example:

```adblock
*$denyallow=com|net
```

- `*$denyallow=com|net`: block everything save for `*.com` and `*.net`.

- `@@*$denyallow=com|net`: unblock everything save for `*.com` and `*.net`.

- `||example.org^$denyallow=sub.example.org`. block `example.org` and
  `*.example.org` but don't block `sub.example.org`.

<br />

## DNS Type

Available since **v0.105.0**.

The `dnstype` modifier allows specifying DNS request or response type on which
this rule will be triggered.

The syntax is:

```adblock
$dnstype=value1|value2|...
$dnstype=~value1|~value2|~...
```

The names of the types are case-insensitive, but are validated against a set of
actual DNS resource record (RR) types.

Do not combine exclusion rules with inclusion ones for example:

```adblock
$dnstype=~value1|value2
```

is equivalent to this:

```adblock
$dnstype=value2
```

- `||example.org^$dnstype=AAAA`: block DNS queries for the IPv6 addresses of
  `example.org`.

- `||example.org^$dnstype=~A|~CNAME`: only allow `A` and `CNAME` DNS queries for
  `example.org`, block out the rest.

{{% alert context="primary" %}}
Before version **v0.108.0,** AdGuard Home would use the type of the request to
filter the response records, as opposed to the type of the response record
itself. That caused issues, since that meant that you could not write rules that
would allow certain `CNAME` records in responses in `A` and `AAAA` requests. In
**v0.108.0** that behaviour was changed, so now this:
{{% /alert %}}

```adblock
||canon.example.com^$dnstype=~CNAME
```

allows you to avoid filtering of the following response:

```plaintext
ANSWERS:
->  example.com
    canonical name = canon.example.com.
    ttl = 60
->  canon.example.com
    internet address = 1.2.3.4
    ttl = 60
```

<br />

## DNS Rewrite

Available since **v0.105.0**.

The `dnsrewrite` response modifier allows replacing the content of the response
to the DNS request for the matching hosts. Rules with the `dnsrewrite` response
modifier have higher priority than other rules in AdGuard Home.

The shorthand syntax is:

```adblock
$dnsrewrite=1.2.3.4
$dnsrewrite=abcd::1234
$dnsrewrite=example.net
$dnsrewrite=REFUSED
```

The keywords MUST be in all caps (e.g. `NOERROR`). Keyword rewrites take
precedence over the other and will result in an empty response with an
appropriate response code.

Before **v0.107.3** the only possible keyword is `REFUSED`.

Since **v0.107.3** response codes `NOERROR`, `NXDOMAIN`, and `SERVFAIL` are also
supported.

The full syntax is of the form `RCODE;RRTYPE;VALUE`:

```adblock
$dnsrewrite=NOERROR;A;1.2.3.4
$dnsrewrite=NOERROR;AAAA;abcd::1234
$dnsrewrite=NOERROR;CNAME;example.net
$dnsrewrite=REFUSED;;
```

Since **v0.107.3** a `$dnsrewrite` modifier with the `NOERROR` response code may
also has empty `RRTYPE` and `VALUE` fields.

The `CNAME` one is special because AdGuard Home will resolve the host and add
its info to the response. That is, if `example.net` has IP `1.2.3.4`, and the
user has this in their filter rules for example:

```adblock
||example.com^$dnsrewrite=example.net
! Or:
||example.com^$dnsrewrite=NOERROR;CNAME;example.net
```

then the response will be something like:

```sh
nslookup example.com my.adguard.local
```

```plaintext
Server:		my.adguard.local
Address:	127.0.0.1#53

Non-authoritative answer:
example.com	canonical name = example.net.
Name:	example.net
Address: 1.2.3.4
```

Next, the `CNAME` rewrite. After that, all other records' values are summed as
one response, so this:

```adblock
||example.com^$dnsrewrite=NOERROR;A;1.2.3.4
||example.com^$dnsrewrite=NOERROR;A;1.2.3.5
```

will result in a response with two `A` records.

Currently supported RR types with examples:

- `||4.3.2.1.in-addr.arpa^$dnsrewrite=NOERROR;PTR;example.net.` adds a `PTR`
  record for reverse DNS. Reverse DNS requests for `1.2.3.4` to the AdGuard Home
  DNS server will result in `example.net`.

{{% alert context="primary" %}}
The IP MUST be in reverse order. Before **v0.106.0**, the value had to contain
a final dot, but since **v0.106.0** both forms are accepted. See [RFC 1035].
{{% /alert %}}

- `||example.com^$dnsrewrite=NOERROR;A;1.2.3.4` adds an `A` record with the
  value `1.2.3.4`.

- `||example.com^$dnsrewrite=NOERROR;AAAA;abcd::1234` adds an `AAAA` record with
  the value `abcd::1234`.

- `||example.com^$dnsrewrite=NOERROR;CNAME;example.org` adds a `CNAME` record.
  See explanation above.

- `||example.com^$dnsrewrite=NOERROR;HTTPS;32 example.com alpn=h3` adds an
  `HTTPS` record. Only a subset of parameter values is supported: values must be
  `contiguous` and, where a `value-list` is expected`, only one value is
  currently supported:

  ```plaintext
  ipv4hint=127.0.0.1             // Supported.
  ipv4hint="127.0.0.1"           // Unsupported.
  ipv4hint=127.0.0.1,127.0.0.2   // Unsupported.
  ipv4hint="127.0.0.1,127.0.0.2" // Unsupported.
  ```

  This will change in the future.

- `||example.com^$dnsrewrite=NOERROR;MX;32 example.mail` adds an `MX` record
  with precedence value `32` and exchange value `example.mail`.

- `||example.com^$dnsrewrite=NOERROR;SVCB;32 example.com alpn=h3` adds an `SVCB`
  value. See the `HTTPS` example above.

- `||example.com^$dnsrewrite=NOERROR;TXT;hello_world` adds a `TXT` record with
  the value `hello_world`.

- `||_svctype._tcp.example.com^$dnsrewrite=NOERROR;SRV;10 60 8080 example.com`
  adds an `SRV` record with priority value `10`, weight value `60`, port `8080`,
  and target value `example.com`.

- `||example.com^$dnsrewrite=NXDOMAIN;;` responds with an `NXDOMAIN` code.

- `$dnstype=AAAA,denyallow=example.org,dnsrewrite=NOERROR;;` responds with an
  empty `NOERROR` answers for all `AAAA` requests except the ones for
  `example.org`.

{{% alert context="primary" %}}
This is available since **v0.107.3**.
{{% /alert %}}

Exception rules remove one or all rules for example:

- `@@||example.com^$dnsrewrite` removes all DNS rewrite rules.

- `@@||example.com^$dnsrewrite=1.2.3.4` removes the DNS rewrite rule that adds
  an `A` record with the value `1.2.3.4`.

<br />

## Important

The `important` modifier applied to a rule increases its priority over any other
rule without the modifier. Even over basic exception rules for example:

- In this example:

  ```adblock
  ||example.org^$important
  @@||example.org^
  ```

  `||example.org^$important` will block all requests to `*.example.org`. despite
  the exception rule.

- In this example:

  ```adblock
  ||example.org^$important
  @@||example.org^$important
  ```

  the exception rule also has the `important` modifier, so it will work.

<br />

## Badfilter

The rules with the `badfilter` modifier disable other basic rules to which they
refer. It means that the text of the disabled rule should match the text of the
`badfilter` rule (without the `badfilter` modifier) for example:

- `||example.com$badfilter` disables `||example.com`.

- `@@||example.org^$badfilter` disables `@@||example.org^`.

<br />

## Ctags

The `ctag` modifier allows to block domains only for specific types of DNS
client tags. You can assign tags to clients in the AdGuard Home UI. In the
future, we plan to assign tags automatically by analyzing the behavior of each
client.

The syntax is:

```adblock
$ctag=value1|value2|...
```

If one of client's tags matches the `ctag` values, this rule applies to the
client. The syntax for exclusion is:

```adblock
$ctag=~value1|~value2|...
```

If one of client's tags matches the exclusion `ctag` values, this rule doesn't
apply to the client for example:

- `||example.org^$ctag=device_pc|device_phone`: block `example.org` for clients
  tagged as `device_pc` or `device_phone`.

- `||example.org^$ctag=~device_phone`: block `example.org` for all clients
  except those tagged as `device_phone`.

The list of allowed tags:

- By device type:

  - `device_audio`: audio devices.
  - `device_camera`: cameras.
  - `device_gameconsole`: game consoles.
  - `device_laptop`: laptops,
  - `device_nas`: NAS (Network-attached Storages).
  - `device_pc`: PCs.
  - `device_phone`: phones.
  - `device_printer`: printers.
  - `device_securityalarm`: security alarms.
  - `device_tablet`: tablets.
  - `device_tv`: TVs.
  - `device_other`: other devices.

- By operating system:

  - `os_android`: Android.
  - `os_ios`: iOS.
  - `os_linux`: Linux.
  - `os_macos`: macOS.
  - `os_windows`: Windows.
  - `os_other`: other OSes.

- By user group:

  - `user_admin`: administrators.
  - `user_regular`: regular users.
  - `user_child`: children.

<br />

## Hosts-style Syntax

For each host a single line should be present with the following information:

```plaintext
IP_address canonical_hostname [aliases...]
```

Fields of the entries are separated by any number of space or tab characters.
Text from the `#` character until the end of the line is a comment and is
ignored. Modifiers, such as `client` or `badfilter`, don't work with these
rules.

Hostnames may contain only alphanumeric characters, hyphen-minus signs (`-`),
and periods (`.`). They must begin with an alphabetic character and end with an
alphanumeric character. Optional aliases provide for name changes, alternate
spellings, shorter hostnames, or generic hostnames (for example, `localhost`):

```adblock
# This is a comment
127.0.0.1 example.org example.info
127.0.0.1 example.com
127.0.0.1 example.net # this is also a comment
```

The IP addresses are used to respond to the DNS queries for these domains.

<br />

## Domains-only Syntax

A simple list of domain names, one name per line for example:

```adblock
# This is a comment
example.com
example.org
example.net # this is also a comment
```

If a string is not a valid domain (e.g. `*.example.org`), AdGuard Home will
consider it to be an [Adblock-style](#adblock-style-syntax) rule.

<br />

## Hostlists Compiler

If you are maintaining a blocklist and use different sources in it, [Hostlists
compiler] may be useful to you. It is a simple tool that makes it easier to
compile a hosts blocklist compatible with AdGuard Home or any other AdGuard
product with DNS filtering.

What it's capable of:

1. Compile a single blocklist from multiple sources.

2. Exclude the rules you don't need.

3. Cleanup the resulting list: deduplicate, remove invalid rules, and compress
   the list.


[Official: Documentation for write hosts blocklists]:
  https://github.com/AdguardTeam/AdGuardHome/wiki/Hosts-Blocklists
[Hostlist compiler]:https://github.com/AdguardTeam/HostlistCompiler
[traditional Adblock-style]:
  https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters
[regular expressions]: https://github.com/google/re2/wiki/Syntax
[RFC 1035]: https://tools.ietf.org/html/rfc1035#section-3.5
[Hostlists compiler]: https://github.com/AdguardTeam/HostlistCompiler
[AdGuard DNS filter]: https://github.com/AdguardTeam/AdGuardSDNSFilter
