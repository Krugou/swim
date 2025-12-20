# New Features Added 🎉

## Maps View 🗺️

- **Interactive Leaflet Map**: View all swimming halls on an interactive map
- **User Location**: Shows your current location with a blue marker and radius
- **Hall Markers**: Click on any hall marker to see details and get directions
- **Google Maps Integration**: Get directions directly to any swimming hall

## Push Notifications 🔔

- **Enable/Disable**: Toggle notifications from the header
- **Browser Support**: Works with browsers that support the Notification API
- **Permission Management**: Request notification permissions with user consent
- **Future Ready**: Infrastructure prepared for availability alerts

## Hall Details Page 📋

- **Slide-in Panel**: Click the info icon on any hall card to see full details
- **Comprehensive Info**:
  - Full description of facilities
  - Address with maps link
  - Opening hours
  - Contact information
  - Available resources with quick actions
- **Mobile Optimized**: Full-screen on mobile, sidebar on desktop

## Quick Actions ⚡

### Share Functionality

- **Web Share API**: Native sharing on mobile devices
- **Clipboard Fallback**: Automatic copy-to-clipboard on desktop
- **Share Details**: Shares hall name, resource, availability status, and booking link

### Calendar Export

- **ICS Format**: Standard calendar format compatible with all calendar apps
- **Next Free Slot**: Export the next available time slot
- **Auto-download**: Calendar file downloads directly to device
- **Complete Info**: Includes location coordinates and time details

## Technical Improvements

- **Leaflet Integration**: Professional mapping with OpenStreetMap tiles
- **Service Architecture**: Clean separation with dedicated services for:
  - Notification management (`notification-service.ts`)
  - Calendar export (`calendar-export.ts`)
- **TypeScript**: Fully typed for better developer experience
- **i18n Support**: All new features available in English, Finnish, and Swedish

## Usage

### Maps View

1. Click the **Map** icon in the header (desktop) or bottom nav (mobile)
2. Grant location permission if prompted
3. See your location and all halls on the map
4. Click markers for hall details and directions

### Notifications

1. Click the **Bell** icon in the header
2. Allow notifications when prompted
3. Toggle on/off anytime from the header

### Hall Details

1. Click the **Info (i)** icon on any hall card
2. Browse full details and facilities
3. Use quick actions to share or add to calendar
4. Click outside or X to close

### Quick Actions

**Share a Hall:**

1. Open hall details
2. Click **Share** button on any resource
3. Choose sharing method (mobile) or auto-copy link (desktop)

**Add to Calendar:**

1. Find a resource with available time
2. Click **Add to Calendar** button
3. Open downloaded .ics file in your calendar app

## Browser Compatibility

- Maps: All modern browsers
- Notifications: Chrome, Firefox, Edge, Safari (with permissions)
- Web Share: Mobile browsers (Chrome, Safari)
- Calendar Export: All browsers (standard ICS format)

## Future Enhancements

These features provide the foundation for:

- Favorite hall notifications
- Custom availability alerts
- Advanced filtering by facility type
- Historical availability patterns
