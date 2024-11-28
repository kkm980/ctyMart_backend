// Validate location format and bounds
export const validateLocation = (location: number[]): boolean => {
    if (!Array.isArray(location) || location.length !== 2) return false;
    const [latitude, longitude] = location;
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  };
  
  // Validate contacts
  export const validateContacts = (contacts: string[]): boolean => {
    if (!Array.isArray(contacts) || contacts.length === 0) return false;
    return contacts.every(contact => {
      // Basic phone number validation (can be enhanced based on requirements)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(contact);
    });
  };
  
  // Validate time format (HH:MM)
  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return time === "closed" || timeRegex.test(time);
  };  
  
  // Validate operating hours
  export const validateOperatingHours = (hours: any): boolean => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return days.every(day => {
      if (!hours[day] || !hours[day].open || !hours[day].close) return false;
      return (
        validateTimeFormat(hours[day].open) &&
        validateTimeFormat(hours[day].close)
      );
    });
  };