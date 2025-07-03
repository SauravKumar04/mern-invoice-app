# Invoice Total Calculation Fix

## Issue Identified
The invoice total calculation was treating tax and discount as absolute dollar amounts instead of percentages, causing incorrect calculations on invoice downloads and displays.

## Root Cause
1. **In `createInvoice` function**: The calculation logic was `total = subtotal + tax - discount`, treating tax and discount as dollar amounts.
2. **In templates**: Tax and discount were displayed directly as stored values without percentage calculation.
3. **In PDFKit generation**: Same issue with direct dollar amount display.
4. **In `updateInvoice` function**: No recalculation logic when invoice details were updated.

## Solutions Implemented

### 1. Fixed Invoice Creation Logic (`server/controllers/invoiceController.js`)
**Before:**
```javascript
const total = subTotal + Number(tax) - Number(discount);
```

**After:**
```javascript
// Calculate tax and discount as percentages of subtotal
const taxAmount = subTotal * (Number(tax) / 100);
const discountAmount = subTotal * (Number(discount) / 100);
const total = subTotal + taxAmount - discountAmount;
```

### 2. Updated All Templates
Fixed all EJS templates to calculate tax and discount amounts dynamically:

**Before:**
```html
<span class="total-label">Tax</span>
<span class="total-value">$<%= invoice.tax.toFixed(2) %></span>
```

**After:**
```html
<% const taxAmount = subtotal * (invoice.tax / 100); %>
<span class="total-label">Tax (<%= invoice.tax %>%)</span>
<span class="total-value">$<%= taxAmount.toFixed(2) %></span>
```

**Templates Updated:**
- `modernTemplate.ejs`
- `minimalTemplate.ejs`
- `invoiceTemplate.ejs`
- `creativeTemplate.ejs`

### 3. Fixed PDFKit Generation
Updated the fallback PDF generation to display percentages:
```javascript
// Tax (if any)
if (invoice.tax > 0) {
  const taxAmount = subtotal * (invoice.tax / 100);
  doc.text(`Tax (${invoice.tax}%)`, totalsX + 20, yPos + 40);
  doc.text(`$${taxAmount.toFixed(2)}`, totalsX + totalsWidth - 70, yPos + 40);
}
```

### 4. Enhanced Update Invoice Function
Added recalculation logic when items, tax, or discount are updated:
```javascript
// If items, tax, or discount are being updated, recalculate the total
if (updateData.items || updateData.tax !== undefined || updateData.discount !== undefined) {
  // Recalculate total with percentage-based tax and discount
  const taxAmount = subTotal * (Number(tax) / 100);
  const discountAmount = subTotal * (Number(discount) / 100);
  const total = subTotal + taxAmount - discountAmount;
  updateData.total = total;
}
```

### 5. Fixed Email Templates
Updated the HTML email templates to use percentage-based calculations for tax and discount display.

### 6. Fixed Email PDF Generation Template Selection
The `sendInvoiceEmail` function was hardcoded to use only `invoiceTemplate.ejs` for Puppeteer PDF generation. Now it correctly uses the invoice's assigned template:

**Before:**
```javascript
const templatePath = path.join(__dirname, "../templates/invoiceTemplate.ejs");
```

**After:**
```javascript
let template = invoice.template || 'invoiceTemplate';
const allowedTemplates = ['invoiceTemplate', 'modernTemplate', 'creativeTemplate', 'minimalTemplate'];
if (!allowedTemplates.includes(template)) {
  template = 'invoiceTemplate'; // Fallback to default
}
const templatePath = path.join(__dirname, `../templates/${template}.ejs`);
```

## Expected Behavior Now
- **Tax Input**: When user enters "10" for tax, it means 10% of subtotal
- **Discount Input**: When user enters "5" for discount, it means 5% of subtotal
- **Display**: Templates now show "Tax (10%): $50.00" instead of "Tax: $10.00"
- **Calculation**: Total = Subtotal + (Subtotal × Tax%) - (Subtotal × Discount%)

## Example Calculation
- **Subtotal**: $500.00
- **Tax**: 10% = $50.00
- **Discount**: 5% = $25.00
- **Total**: $500.00 + $50.00 - $25.00 = $525.00

## Files Modified
1. `server/controllers/invoiceController.js` - Main calculation logic and email PDF template selection
2. `server/templates/modernTemplate.ejs` - Template display
3. `server/templates/minimalTemplate.ejs` - Template display
4. `server/templates/invoiceTemplate.ejs` - Template display
5. `server/templates/creativeTemplate.ejs` - Template display

## PDF Generation Methods Fixed
- **Puppeteer PDF generation** (for email attachments) - Now uses correct template
- **html-pdf-node generation** (for direct downloads) - Uses fixed EJS templates
- **PDFKit fallback generation** - Fixed percentage calculations
- **HTML email display** - Fixed percentage calculations

## Email Template Issue Fixed
**Problem**: Email PDFs were always using the default `invoiceTemplate.ejs` regardless of the invoice's assigned template.

**Solution**: Added proper template selection logic in `sendInvoiceEmail` function with enhanced logging and fallback handling.

## Existing Invoice Template Fix
**Problem**: Existing invoices in the database might not have the `template` field if they were created before this feature was added.

**Solution**: Added a utility function `fixInvoicesWithoutTemplate` that can update all existing invoices to have the default template.

### To Fix Existing Invoices:
Make a POST request to: `/api/invoices/fix-templates`

This will:
1. Find all invoices without template field
2. Set them to use 'invoiceTemplate' as default
3. Return count of fixed invoices

### Added Enhanced Debugging:
The system now logs:
- Invoice template field value and type
- Template selection process
- Fallback actions when template is missing/invalid

The invoice download functionality should now display correct percentage-based tax and discount calculations instead of treating them as absolute values, AND use the correct template for email PDFs.