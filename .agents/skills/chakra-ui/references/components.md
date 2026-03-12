# Chakra UI v3 — Component Reference

> Source: NotebookLM notebook `chakra-ui` (Migration guide + official docs)

## Index

1. [Button](#button)
2. [Input / Field](#input--field)
3. [Dialog](#dialog)
4. [Menu](#menu)
5. [Tabs](#tabs)
6. [Card](#card)
7. [Table](#table)
8. [Toast / Toaster](#toast--toaster)
9. [Drawer](#drawer)
10. [Select (NativeSelect)](#select-nativeselect)

---

## Button

**Key props:** `colorPalette`, `variant` (solid | outline | ghost | plain), `size`,
`disabled`, `loading`, `unstyled`

```tsx
<Button colorPalette="blue" variant="solid" disabled={false} loading={false}>
  <LuArrowRight /> Click Me
</Button>
```

**❌ Anti-pattern:**
```tsx
// v2 syntax — will NOT work in v3
<Button leftIcon={<MailIcon />} colorScheme="blue" isDisabled isLoading>
  Email
</Button>
```

**Renames:** `isDisabled` → `disabled`, `isLoading` → `loading`, `colorScheme` →
`colorPalette`, `leftIcon`/`rightIcon` → render as children, `variant="link"` →
`variant="plain"`, `iconSpacing` → `gap`.

---

## Input / Field

**Key props (Field.Root):** `invalid`, `required`, `disabled`, `readOnly`

```tsx
<Field.Root invalid={hasError} required>
  <Field.Label>Email</Field.Label>
  <Input type="email" placeholder="name@example.com" />
  <Field.HelperText>We will never share your email.</Field.HelperText>
  <Field.ErrorText>Valid email is required.</Field.ErrorText>
</Field.Root>
```

> `Field.ErrorText` only renders when `invalid` is `true` — no conditional logic needed.

**❌ Anti-pattern:**
```tsx
// v2 FormControl — removed in v3
<FormControl isInvalid isRequired>
  <FormLabel>Email</FormLabel>
  <Input />
  <FormErrorMessage>Email is required</FormErrorMessage>
</FormControl>
```

**Renames:** `FormControl` → `Field.Root`, `FormLabel` → `Field.Label`,
`FormHelperText` → `Field.HelperText`, `FormErrorMessage` → `Field.ErrorText`.
For grouped controls: `FormControl as="fieldset"` → `Fieldset.Root`.

---

## Dialog

**Key props (Dialog.Root):** `open`, `onOpenChange`, `placement` (center),
`closeOnInteractOutside`, `closeOnEscape`, `preventScroll`

```tsx
<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>Title</Dialog.Header>
      <Dialog.Body>Content goes here.</Dialog.Body>
      <Dialog.Footer>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger />
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

**❌ Anti-pattern:**
```tsx
// v2 Modal — removed in v3, missing Positioner wrapper
<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalCloseButton />
  </ModalContent>
</Modal>
```

**Renames:** `Modal` → `Dialog.Root`, `ModalOverlay` → `Dialog.Backdrop`,
`ModalContent` → `Dialog.Content` (wrap in `Dialog.Positioner`),
`isOpen` → `open`, `onClose` → `onOpenChange`, `isCentered` → `placement="center"`,
`initialFocusRef` → `initialFocusEl={() => ref.current}`.

---

## Menu

**Key props (Menu.Root):** State accessed via `Menu.Context` (not render props).
`Menu.Trigger` requires `asChild` when wrapping a `Button`.

```tsx
<Menu.Root>
  <Menu.Trigger asChild>
    <Button>Open Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item value="new">New File</Menu.Item>
    <Menu.Item value="open">Open File</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

**❌ Anti-pattern:**
```tsx
// v2 flat components + render props — removed in v3
<Menu>
  {({ isOpen }) => (
    <>
      <MenuButton>{isOpen ? 'Close' : 'Open'}</MenuButton>
      <MenuList>
        <MenuItem>Item</MenuItem>
      </MenuList>
    </>
  )}
</Menu>
```

**Renames:** `MenuButton` → `Menu.Trigger`, `MenuList` → `Menu.Content`,
`MenuItem` → `Menu.Item` (requires `value`). Internal state via `Menu.Context`.

---

## Tabs

**Key props (Tabs.Root):** `defaultValue`, `value`, `onValueChange`,
`lazyMount`, `unmountOnExit`

```tsx
<Tabs.Root defaultValue="profile" onValueChange={(d) => console.log(d.value)}>
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="profile">Profile settings.</Tabs.Content>
  <Tabs.Content value="settings">Preferences.</Tabs.Content>
</Tabs.Root>
```

**❌ Anti-pattern:**
```tsx
// v2 — index-based, flat components
<Tabs defaultIndex={0} onChange={(index) => console.log(index)}>
  <TabList><Tab>Profile</Tab></TabList>
  <TabPanels><TabPanel>Settings</TabPanel></TabPanels>
</Tabs>
```

**Renames:** `defaultIndex` → `defaultValue`, `index` → `value`,
`onChange` → `onValueChange`, `isLazy` → `lazyMount` + `unmountOnExit`.
`value` prop is now **required** on `Tabs.Trigger` and `Tabs.Content`.

---

## Card

**Key props:** All original v2 styling props remain. New semantic sub-components
`Card.Title` and `Card.Description` introduced.

```tsx
<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Brief description.</Card.Description>
  </Card.Header>
  <Card.Body>Main content.</Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card.Root>
```

**❌ Anti-pattern:**
```tsx
// v2 flat components
<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
</Card>
```

**Renames:** `Card` → `Card.Root`, `CardHeader` → `Card.Header`,
`CardBody` → `Card.Body`, `CardFooter` → `Card.Footer`.

---

## Table

**Key props:** `Table.ScrollArea` replaces `TableContainer`.
`isNumeric` removed — use `textAlign="end"`.

```tsx
<Table.ScrollArea>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader>Item</Table.ColumnHeader>
        <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Keyboard</Table.Cell>
        <Table.Cell textAlign="end">$120</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Table.ScrollArea>
```

**❌ Anti-pattern:**
```tsx
// v2 HTML-like names
<TableContainer>
  <Table>
    <Thead><Tr><Th isNumeric>Price</Th></Tr></Thead>
  </Table>
</TableContainer>
```

**Renames:** `TableContainer` → `Table.ScrollArea`, `Thead` → `Table.Header`,
`Tr` → `Table.Row`, `Th` → `Table.ColumnHeader`, `Td` → `Table.Cell`.

---

## Toast / Toaster

**Key props:** Configured via `createToaster()` (not via ChakraProvider).
Options: `placement`, `duration`.

```tsx
// components/ui/toaster.tsx
import { createToaster } from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom",
  duration: 5000,
})

// Usage anywhere in the app
toaster.create({
  title: "Profile updated.",
  type: "success",
})
```

**❌ Anti-pattern:**
```tsx
// v2 — configuring in provider (removed in v3)
<ChakraProvider toastOptions={{ defaultOptions: { position: 'top' } }}>
  <App />
</ChakraProvider>
```

---

## Drawer

**Key props (Drawer.Root):** `open`, `onOpenChange`, `placement` (start | end | top | bottom),
`preventScroll`, `closeOnEscape`, `closeOnInteractOutside`

```tsx
<Drawer.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)} placement="start">
  <Drawer.Backdrop />
  <Drawer.Positioner>
    <Drawer.Content height="100%">
      <Drawer.Header>Menu</Drawer.Header>
      <Drawer.Body>Drawer content.</Drawer.Body>
      <Drawer.Footer>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </Drawer.Footer>
      <Drawer.CloseTrigger />
    </Drawer.Content>
  </Drawer.Positioner>
</Drawer.Root>
```

**❌ Anti-pattern:**
```tsx
// v2 — flat components, non-RTL placement, missing Positioner
<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerBody>Content</DrawerBody>
  </DrawerContent>
</Drawer>
```

**Renames:** `isOpen` → `open`, `onClose` → `onOpenChange`,
`placement="left"` → `placement="start"`, `placement="right"` → `placement="end"`,
`isFullHeight` → `height="100%"` on `Drawer.Content`,
`DrawerOverlay` → `Drawer.Backdrop`,
`DrawerContent` → `Drawer.Positioner` + `Drawer.Content`.

---

## Select (NativeSelect)

**Key props (NativeSelect.Root):** `disabled`, `colorPalette`.
Wrap in `Field.Root` for validation.

```tsx
<NativeSelect.Root>
  <NativeSelect.Field placeholder="Select framework">
    <option value="react">React</option>
    <option value="vue">Vue</option>
  </NativeSelect.Field>
  <NativeSelect.Indicator />
</NativeSelect.Root>
```

**❌ Anti-pattern:**
```tsx
// v2 flat Select
<Select icon={<MdArrowDropDown />}>
  <option value="1">Option 1</option>
</Select>
```

**Renames:** `Select` → `NativeSelect.Root` + `NativeSelect.Field`,
icon customization via `NativeSelect.Indicator`.
`isInvalid` removed from input — wrap in `Field.Root` with `invalid` instead.
