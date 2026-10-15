# @skyra-tech-platform/notification

Framework-agnostic notification bar. Importing the package registers canonical `skyra-tech-notification-bar` and compatible `skyra-notification-bar` tags.

## Installation

```sh
pnpm add @skyra-tech-platform/notification
```

## Usage

```html
<script type="module">
  import '@skyra-tech-platform/notification';
</script>
<skyra-tech-notification-bar type="success">
  <span slot="title">Saved</span>
  Your changes were saved.
</skyra-tech-notification-bar>
```

The main entry exports `SkyraNotificationBarElement` and the `NotificationType` type. Component styles are embedded; this package is not the Button package.
