# Guide: Steg-för-steg-guide för att skriva tester

Denna guide beskriver hur du systematiskt kan skriva tester genom att utgå från acceptanskriterier, analysera koden och därefter implementera tester enligt ett tydligt och strukturerat arbetssätt.

---

## 1. Förstå vad som behöver testas

### Steg 1: Gå igenom acceptanskriterierna

Exempel från User Story 1:

- ✅ Användaren ska kunna välja datum och tid  
- ✅ Användaren ska kunna ange antal spelare (minst 1)  
- ✅ Användaren ska kunna reservera en eller flera banor  

**Viktigt att komma ihåg:**  
Varje acceptanskriterium bör täckas av minst ett test. Om funktionaliteten är mer avancerad kan flera tester krävas.

---

## 2. Analysera koden för att förstå funktionaliteten

### Steg 2: Granska Booking.jsx

```javascript
// Komponenten innehåller inputs med name-attribut
<input name="when" type="date" />
<input name="time" type="time" />
<input name="people" type="number" />
<input name="lanes" type="number" />
````

**Slutsatser från koden:**

* Inputs identifieras via `name`-attribut istället för `id`
* Labels är inte kopplade till inputs (ingen `htmlFor` eller `id`)
* Tester måste därför använda `querySelector` med `name`-attribut

---

## 3. Testernas struktur

Alla tester följer samma grundprincip, även kallad AAA-pattern:

### Arrange – förbered testmiljön

```javascript
const { container } = renderBooking();
const dateInput = container.querySelector('input[name="when"]');
```

### Act – utför användarens handling

```javascript
await userEvent.type(dateInput, "2024-12-25");
```

### Assert – verifiera resultatet

```javascript
expect(dateInput).toHaveValue("2024-12-25");
```

---

## 4. Exempel: Ett enkelt test, steg för steg

### Test: "should allow user to select a date from calendar"

```javascript
it("should allow user to select a date from calendar", async () => {
  // ============================================
  // STEG 1: ARRANGE – Rendera komponenten
  // ============================================
  const { container } = renderBooking();
  // Komponenten måste finnas i DOM innan testning

  // ============================================
  // STEG 2: Hitta rätt inputfält
  // ============================================
  const dateInput = container.querySelector('input[name="when"]');
  // querySelector används eftersom labels saknas

  // ============================================
  // STEG 3: Kontrollera att elementet finns
  // ============================================
  expect(dateInput).toBeInTheDocument();
  expect(dateInput).toHaveAttribute("type", "date");

  // ============================================
  // STEG 4: ACT – Simulera användarinmatning
  // ============================================
  await userEvent.type(dateInput, "2024-12-25");
  // userEvent används för att efterlikna riktig användarinteraktion

  // ============================================
  // STEG 5: ASSERT – Verifiera resultatet
  // ============================================
  expect(dateInput).toHaveValue("2024-12-25");
});
```

---

## 5. Exempel: Mer avancerat test med felhantering

### Test: "should show error message when date is missing"

**Acceptanskriterium:**
VG – Om användaren inte fyller i alla obligatoriska fält ska ett felmeddelande visas.

**Tankesätt:**

1. Identifiera vad som ska testas – felmeddelande vid saknat datum
2. Användaren fyller i alla fält utom datum
3. Ett felmeddelande ska visas med korrekt text

```javascript
it("should show error message when date is missing", async () => {
  // ============================================
  // STEG 1: ARRANGE
  // ============================================
  const { container } = renderBooking();

  // ============================================
  // STEG 2: Fyll i alla fält utom datum
  // ============================================
  const timeInput = container.querySelector('input[name="time"]');
  const playersInput = container.querySelector('input[name="people"]');
  const lanesInput = container.querySelector('input[name="lanes"]');

  await userEvent.type(timeInput, "18:00");
  await userEvent.type(playersInput, "2");
  await userEvent.type(lanesInput, "1");
  // Datum lämnas tomt medvetet

  // ============================================
  // STEG 3: ACT – Försök genomföra bokningen
  // ============================================
  const submitButton = screen.getByTestId("booking-submit-button");
  await userEvent.click(submitButton);
  // Valideringen sker i book()-funktionen

  // ============================================
  // STEG 4: ASSERT – Vänta in och kontrollera felmeddelandet
  // ============================================
  await waitFor(() => {
    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Alla fälten måste vara ifyllda");
  });
});
```

---

## 6. Exempel: Test med flera dynamiska element (skor)

### Test: "should allow user to select shoe size for all players"

**Acceptanskriterium:**
Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen.

**Testidé:**

* Lägg till flera skor
* Fyll i olika storlekar
* Kontrollera att alla värden sparas korrekt

```javascript
it("should allow user to select shoe size for all players in the booking", async () => {
  // ============================================
  // STEG 1: ARRANGE
  // ============================================
  const { container } = renderBooking();

  // ============================================
  // STEG 2: Lägg till tre skor
  // ============================================
  const addShoeButton = screen.getByTestId("add-shoe-button");
  await userEvent.click(addShoeButton);
  await userEvent.click(addShoeButton);
  await userEvent.click(addShoeButton);

  // ============================================
  // STEG 3: Hitta alla skoinputs
  // ============================================
  const shoeInputs = container.querySelectorAll('input[type="text"]');
  expect(shoeInputs).toHaveLength(3);

  // ============================================
  // STEG 4: ACT – Fyll i skostorlekar
  // ============================================
  await userEvent.type(shoeInputs[0], "42");
  await userEvent.type(shoeInputs[1], "40");
  await userEvent.type(shoeInputs[2], "38");

  // ============================================
  // STEG 5: ASSERT – Verifiera värdena
  // ============================================
  expect(shoeInputs[0]).toHaveValue("42");
  expect(shoeInputs[1]).toHaveValue("40");
  expect(shoeInputs[2]).toHaveValue("38");
});
```

---

## 7. Arbetsflöde vid testskrivning

### Checklista:

1. Läs acceptanskriterierna noggrant
2. Analysera koden och dess element
3. Planera vilka steg användaren utför
4. Implementera testet enligt AAA-mönstret
5. Kör testerna och rätta eventuella fel

---

## 8. Vanliga frågor

**Varför används `await` så ofta?**
Eftersom `userEvent` och `waitFor` är asynkrona och väntar på DOM-uppdateringar.

**Varför används `waitFor` vid felmeddelanden?**
React uppdaterar state asynkront, och `waitFor` säkerställer att elementet verkligen renderas.

**Varför används `querySelector` istället för `getByLabelText`?**
Inputs saknar kopplade labels och kan därför inte hittas via `getByLabelText`.

**Varför används `getByTestId` för knappar?**
`data-testid` gör testerna stabilare och mindre känsliga för UI-förändringar.

**Var finns definitionerna av felmeddelanden?**
I `Booking.jsx`, i funktionen `book()`.

---

## 9. Tips för att komma igång med testning

1. Börja med enkla tester
2. Utöka gradvis med mer komplex funktionalitet
3. Återanvänd samma teststruktur
4. Glöm inte att testa felaktiga scenarier
5. Kör tester regelbundet under utvecklingen

---

## 10. Exempel: Resonemang för ett nytt test

**Scenario:** Testa att användaren kan ta bort en skostorlek.

**Steg:**

1. Användaren klickar på minus-knappen
2. En skoinput ska tas bort

```javascript
it("should allow user to remove a shoe size", async () => {
  const { container } = renderBooking();

  // Lägg till två skor
  const addShoeButton = screen.getByTestId("add-shoe-button");
  await userEvent.click(addShoeButton);
  await userEvent.click(addShoeButton);

  // Kontrollera att två inputs finns
  let shoeInputs = container.querySelectorAll('input[type="text"]');
  expect(shoeInputs).toHaveLength(2);

  // Ta bort första skon
  const removeButton = screen.getByTestId("remove-shoe-0");
  await userEvent.click(removeButton);

  // Verifiera att endast en input återstår
  shoeInputs = container.querySelectorAll('input[type="text"]');
  expect(shoeInputs).toHaveLength(1);
});
```

**Klart!**