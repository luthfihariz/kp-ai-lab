# Page objects in apps/qa/pages

- `LoginPage`: `goto()`, `login(email, password)`, `errorMessage()`.
- Add a new page object only when two or more tests need the same screen. Put it in `apps/qa/pages/<Name>Page.ts`, with the constructor taking `page`.
- Locators: `getByRole` first, then `getByLabel`, then `getByText`. No CSS selectors that depend on styling.
- Users: `budi` and `siti` from `apps/qa/fixtures/users.ts`. Never type real customer data.