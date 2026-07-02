// Wikidata "instance of" (P31) types that mark an item as a public / scientific
// institution. Matched transitively via P31/P279* so subclasses are included too
// (e.g. "academic library" is a subclass of "library"). Chosen to be country-agnostic
// so the same set works for DE, NL, AT, CH and the worldwide list.
export const institutionTypes = [
  // Science & higher education
  'Q3918', //    university
  'Q38723', //   higher education institution
  'Q875538', //  public university
  'Q1365560', // university of applied sciences (Fachhochschule)
  'Q31855', //   research institute
  'Q3914', //    school
  'Q170087', //  adult education centre (Volkshochschule)
  'Q1391145', // learned society / professional association (Fachgesellschaft)

  // Cultural memory institutions
  'Q7075', //    library
  'Q166118', //  archive
  'Q33506', //   museum

  // Public administration
  'Q56061', //   administrative territorial entity (municipalities, districts, states …)
  'Q327333', //  government agency (Behörde)
  'Q192350', //  ministry
  'Q2659904', // government organization
  'Q294163' //   public institution
]

export const institutionItems = [
  'Q2422744' // SURF — Dutch national research & education network (operates video.edu.nl)
]

// SPARQL graph pattern matching an institution: either an instance of (subclass of)* one of
// the institution types, OR an explicitly allow-listed item. Expects ?item to be bound.
export const institutionFilterClause = () => {
  const typeValues = institutionTypes.map((qid) => `wd:${qid}`).join(' ')
  const itemValues = institutionItems.map((qid) => `wd:${qid}`).join(' ')
  return `{
    { ?item wdt:P31/wdt:P279* ?type. VALUES ?type { ${typeValues} } }
    UNION
    { VALUES ?item { ${itemValues} } }
  }`
}
