export const getCurrentKey = () => {
    const queryString = window.location.search;
    if(queryString === '' || queryString.includes('=hochschulen-de')){
      return 'hochschulen-de'
    }else if(queryString.includes('=institute-de')){
      return 'institute-de'
  }else if(queryString.includes('=wissenschaftler_innen-de')){
    return 'wissenschaftler_innen-de'
}else{
      return null
    }
}