export const preProcessPlace = (place) => {
  const addComponents = place.address_components;
  let city = '';
  let district = '';
  let streetNum = ''; 
  let country = ''; 
  let street = ''; 
  let ward = '';

  addComponents.forEach((c) => {
    switch (c.types[0]) {
      case 'administrative_area_level_1':
        city = c.long_name
        break;
      case 'administrative_area_level_2':
        district = c.short_name;
        break;
      case 'street_number':
        streetNum = c.long_name;
        break;
      case 'route':
        street = c.long_name;
        break;
      case 'country':
        country = c.long_name;
        break;
      case 'political':
      case 'sublocality_level_1':
        ward = c.long_name;
        break;
    }
  });

  street = `${streetNum} ${street}`;

  return {
    city,
    district,
    street,
    country,
    ward,
  };
}
