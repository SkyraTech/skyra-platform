import { QRCode } from "@skyra/qr/react";
import { Button } from "@skyra/ui";
import "@skyra/ui/styles.css";

export default function Page() {
  return (
    <div>
      <QRCode value="https://example.com" />
      <Button>Click me</Button>
    </div>
  );
}
