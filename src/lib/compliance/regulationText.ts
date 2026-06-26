export interface RegulationArticle {
  id: string;
  title: string;
  category: "General" | "Registration" | "Rules" | "Zero-Rate" | "Exemptions" | "Input Tax" | "Invoices" | "Records";
  summary: string;
  content: string;
}

export const REGULATION_ARTICLES: RegulationArticle[] = [
  {
    id: "article-1",
    title: "Article 1 – Definitions",
    category: "General",
    summary: "Official definitions of key tax terms (Taxable Person, TRN, Input Tax, Output Tax).",
    content: `State: United Arab Emirates.
Minister: Minister of Finance.
Authority: Federal Tax Authority.
Value Added Tax (VAT): A tax imposed on the import and supply of Goods and Services at each stage of production and distribution, including Deemed Supply.
GCC States: All countries that are full members of The Cooperation Council for the Arab States of the Gulf pursuant to its Charter.
Implementing States: GCC States that are implementing a Tax law pursuant to an issued legislation.
Goods: Physical property that can be supplied including but not limited to real estate, water, and all forms of energy as specified in this Decision.
Services: Anything that can be supplied other than Goods.
Standard rate: The Tax rate specified in Article 3 of the Decree-Law (5%).
Import: The arrival of Goods from abroad into the State or receiving Services from outside the State.
Taxable Person: Any Person registered or obligated to register for Tax purposes under the Decree-Law.
Taxpayer: Any person obligated to pay Tax in the State under the Decree-Law, whether a Taxable Person or end consumer.
Tax Registration Number (TRN): A unique number issued by the Authority for each Person registered for Tax purposes.
Registrant: The Taxable Person issued with a TRN.
Tax Return: Information and data specified for Tax purposes and submitted by a Taxable Person in accordance with a form prepared by the Authority.`
  },
  {
    id: "article-7",
    title: "Article 7 – Mandatory Registration",
    category: "Registration",
    summary: "Threshold and timelines for mandatory VAT registration (AED 375,000).",
    content: `1. The Mandatory Registration Threshold shall be AED 375,000 (three hundred and seventy-five thousand dirhams).
2. The Person required to register for Tax pursuant to the provisions of the Decree-Law must file a Tax Registration application with the Authority within 30 days of being required to register.
3. Where a Person does not file his Tax Registration application despite being required to, the Authority shall register that Person with effect from the date on which the Person first became liable to be registered for Tax and impose the necessary penalties.
4. Where supplies made by a Person exceed the Mandatory Registration Threshold during the previous 12-months period, the Authority shall register the Person with effect from the first day of the month following the month in which the Person is required to register.
5. Where a Person expects that his supplies will exceed the Mandatory Registration Threshold during the next 30 days, the Authority shall register him with effect from the date on which there are reasonable grounds for believing the Person will be required to register.`
  },
  {
    id: "article-8",
    title: "Article 8 – Voluntary Registration",
    category: "Registration",
    summary: "Threshold and rules for optional registration based on supplies or expenses (AED 187,500).",
    content: `1. The Voluntary Registration Threshold shall be AED 187,500 (one hundred and eighty-seven thousand five hundred dirhams).
2. Where a Person applied to register voluntarily, the Authority shall register a Person with effect from the first day of the month following the month in which the application is made, or from such earlier date as requested.
3. Where a Person applied to register voluntarily due to his expectation that his supplies will exceed the Voluntary Registration Threshold during the next 30 days, he should be able to provide evidence of an intention to make Taxable Supplies or incur expenses which are subject to Tax in excess of the Voluntary Registration Threshold.`
  },
  {
    id: "article-29",
    title: "Article 29 – Accounting for Tax on the Margin",
    category: "Rules",
    summary: "Profit margin scheme rules for second-hand goods, antiques, and collectors' items.",
    content: `1. The Taxable Person may calculate Tax on any supply of Goods by reference to the profit margin in the following situations:
   a. Where he made a supply of Goods purchased from either a Person who is not a Registrant, or a Taxable Person who calculated the Tax on the supply by reference to the profit margin.
   b. Where he made a supply of Goods for which Input Tax was not recovered.
2. The Goods subject to the profit margin scheme are:
   a. Second-hand Goods (tangible moveable property suitable for further use as is or after repair).
   b. Antiques (goods over 50 years old).
   c. Collectors' items (stamps, coins, currency, and pieces of scientific or historical interest).
3. The profit margin is the difference between the purchase price and the selling price, and shall be deemed to be inclusive of Tax.`
  },
  {
    id: "article-30",
    title: "Article 30 – Zero-rating the Export of Goods",
    category: "Zero-Rate",
    summary: "Conditions under which the direct or indirect export of goods is subject to 0% VAT.",
    content: `1. Direct Export shall be subject to the zero rate if:
   a. Goods are physically exported to a place outside the Implementing States or put into a customs suspension regime within 90 days of the supply.
   b. Official and commercial evidence of Export or customs suspension is retained by the exporter.
2. Indirect Export shall be subject to the zero rate if:
   a. Goods are physically exported to a place outside the Implementing States within 90 days under an arrangement agreed by the supplier and the Overseas Customer.
   b. The Overseas Customer obtains official and commercial evidence of Export and provides the supplier with a copy.
   c. Goods are not used or altered in the time between supply and export.
4. Official evidence means Export documents issued by the local Emirate Customs Department. Commercial evidence includes airway bill, bill of lading, consignment note, or certificate of shipment.`
  },
  {
    id: "article-31",
    title: "Article 31 – Zero-rating the Export of Services",
    category: "Zero-Rate",
    summary: "Conditions for applying 0% VAT to services exported to non-residents.",
    content: `1. The Export of Services shall be zero-rated if:
   a. Services are supplied to a Recipient who does not have a Place of Residence in an Implementing State and is outside the State at the time the services are performed.
   b. Services are not supplied directly in connection with real estate situated in the State or moveable personal assets situated in the State.
2. A Person is considered as being 'outside the State' if they only have a short-term presence in the State of less than a month and the presence is not effectively connected with the supply.`
  },
  {
    id: "article-40",
    title: "Article 40 – Zero-rating Education Services",
    category: "Zero-Rate",
    summary: "Conditions and exclusions for applying 0% VAT to educational services and materials.",
    content: `1. The supply of educational services shall be subject to the zero rate if:
   a. The supply is provided in accordance with the curriculum recognised by the federal or local competent government entity regulating the education sector.
   b. The supplier is a recognized educational institution.
2. Printed and digital reading material provided by educational institutions related to the curriculum shall be zero-rated.
4. Exclusions (subject to standard rate):
   a. Goods and services supplied to persons not enrolled in the institution.
   b. Uniforms or any other clothing required to be worn.
   c. Electronic devices, irrespective of educational use.
   d. Food and beverages.
   e. Field trips that are predominantly recreational.
   f. Extracurricular activities provided for an additional fee.`
  },
  {
    id: "article-41",
    title: "Article 41 – Zero-rating Healthcare Services",
    category: "Zero-Rate",
    summary: "Zero-rating conditions for medical treatments and pharmaceutical products.",
    content: `1. Healthcare services shall be zero-rated if:
   a. Made by a licensed healthcare body, institution, doctor, nurse, dentist, or pharmacy.
   b. Relate to the wellbeing of a human being.
3. Exclusions:
   a. Stays in establishments whose principal purpose is holiday accommodation or entertainment.
   b. Elective treatment for cosmetic reasons unless prescribed by a medical professional for treatment.
4. A supply of Goods is zero-rated if it is a supply of:
   a. Any pharmaceutical products identified by Cabinet decision.
   b. Any medical equipment identified by Cabinet decision.`
  },
  {
    id: "article-42",
    title: "Article 42 – Tax Treatment of Financial Services",
    category: "Exemptions",
    summary: "Financial services exempt from VAT, and exceptions subject to standard rate.",
    content: `2. Financial services are services connected to dealings in money (or its equivalent) and the provision of credit, including:
   a. Exchange of currency.
   b. Issue, payment, collection, or transfer of ownership of a cheque or letter of credit.
   c. Issue, allotment, drawing, or transfer of a debt or equity security.
   d. Provision of any loan, advance, or credit.
   e. Provision or transfer of ownership of life insurance contracts.
3. The following financial services shall be exempted:
   a. Activities under Clause 2 where they are not conducted in return for an explicit fee, discount, commission, or rebate.
   b. The issue, allotment, or transfer of ownership of equity or debt securities.
   c. Provision of life insurance contracts.
4. Activities shall be subject to tax (5%) where the consideration payable is an explicit fee, commission, discount, or rebate.`
  },
  {
    id: "article-43",
    title: "Article 43 – Exemption of Residential Buildings",
    category: "Exemptions",
    summary: "Exempt status of residential leases and sales, excluding zero-rated first supplies.",
    content: `1. The supply of residential buildings is exempt, unless it is zero-rated (such as the first supply within 3 years of completion), where the lease is more than 6 months or the tenant holds a UAE ID card.
2. The period of tenancy shall be identified with reference to the contractual period and shall not take into account options to extend or renew.`
  },
  {
    id: "article-53",
    title: "Article 53 – Non-recoverable Input Tax",
    category: "Input Tax",
    summary: "CRITICAL: Strict categories where input VAT cannot be reclaimed (hospitality, entertainment, personal cars).",
    content: `1. Input Tax shall be non-recoverable (cannot be reclaimed) if incurred in respect of:
   a. Entertainment services provided to anyone not employed by the Person, including customers, potential customers, officials, or shareholders.
   b. A motor vehicle purchased, rented, or leased for use in the Business if it is available for personal use by any Person (designed to convey no more than 10 people including the driver, excluding emergency vehicles, taxis, and rentals).
   c. Goods or Services purchased to be used by employees for no charge and for their personal benefit, including entertainment, unless:
      1) There is a legal obligation to provide them under applicable labor laws.
      2) There is a contractual obligation or documented policy to provide them so they can perform their role, conforming to normal business practice.
2. Entertainment services mean hospitality of any kind, including accommodation, food and drinks not provided in the normal course of a meeting, access to shows or events, or trips.`
  },
  {
    id: "article-59",
    title: "Article 59 – Tax Invoice Requirements",
    category: "Invoices",
    summary: "CRITICAL: Elements required for a full or simplified tax invoice to be valid.",
    content: `1. A valid full Tax Invoice must contain:
   a. The words 'Tax Invoice' clearly displayed.
   b. Name, address, and TRN of the supplier.
   c. Name, address, and TRN of the recipient (if registered).
   d. A sequential unique invoice number.
   e. Date of issue (and date of supply if different).
   f. Description of the Goods or Services.
   g. Unit price, quantity/volume, rate of Tax, and amount payable in AED.
   h. Amount of any discount.
   i. Gross amount payable in AED.
   j. Tax amount payable in AED (and exchange rate if foreign currency).
2. A simplified Tax Invoice (for non-registrants or supplies <= AED 10,000) must contain:
   a. The words 'Tax Invoice' clearly displayed.
   b. Name, address, and TRN of the supplier.
   c. Date of issue.
   d. Description of Goods or Services.
   e. Total Consideration and the Tax amount charged.`
  },
  {
    id: "article-71",
    title: "Article 71 – Record-keeping Requirements",
    category: "Records",
    summary: "Timeframes and conditions for preserving VAT records and documents.",
    content: `1. Records required to be kept must comply with timeframes and conditions for retention as specified in Tax Procedures.
2. Any records related to a real estate required to be kept shall be held for a period of 15 years after the end of the Tax Period to which they relate.
(Note: General tax records must be retained for a minimum of 5 years under Federal Law No. 7 of 2017 on Tax Procedures).`
  }
];
