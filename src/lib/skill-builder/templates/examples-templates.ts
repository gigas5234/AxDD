export type ExampleFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

const UX_UI_EXAMPLE = `# Example — Order Status screen

## Input from user
"I need a screen where customers can check the status of their food delivery order.
They land here after tapping the order in their order list."

## Expected output

### 1. Problem
A customer wants to know where their order is, when it will arrive, and what to do if something is wrong.

### 2. Primary action
Tap **Contact rider** when the order is on the way; tap **Help** otherwise.

### 3. Information hierarchy
1. Order state (Preparing / On the way / Delivered)
2. ETA
3. Rider info + contact action
4. Order summary
5. Help / report a problem

### 4. Components
- \`OrderStateHeader\` — variant: preparing | on-the-way | delivered
- \`EtaCard\` — props: eta, address
- \`RiderCard\` — props: name, photoUrl, phone
- \`OrderSummary\` — props: items[], total
- \`HelpRow\` — props: onPressReport

### 5. States
- **Default** — order in progress, all data present
- **Empty** — no rider assigned yet → hide RiderCard, show "Looking for a rider"
- **Loading** — skeletons for state header, ETA, rider
- **Error** — show "Couldn't load order status", retry button

### 6. Responsive notes
- Mobile: single column, sticky bottom CTA for primary action
- Tablet+: two-column with map preview on the right (optional)

### 7. Implementation notes
- Use tokens: \`surface\`, \`ink\`, \`accent\`, \`muted\`
- Poll order state every 15s while screen is foregrounded
- Reduce motion when \`prefers-reduced-motion\` is set
`;

export function buildExampleFiles(): ExampleFileSpec[] {
  return [
    {
      fileName: "ux-ui-example.md",
      content: UX_UI_EXAMPLE,
      generatedFrom: ["ex-ux-ui"],
    },
  ];
}
