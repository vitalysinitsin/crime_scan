[DEMO](https://hungryvito.github.io/cluster_test/)

Project to test out [@use-supercluster](https://github.com/leighhalliday/use-supercluster) and [@google-map-react](https://github.com/google-map-react/google-map-react) functionality

Initial idea is to make it possible to have 2 levels of waterfall clustering 
for 2 types of markers. With every click on the marker, the parent should 
expand to the next level. When children are displayed, they must be connected 
with polylines to represent grouping. Additionally, there should be a button 
to zoom out to the previous level too.

I aim to have two uses for the app.

The first one would use static data with Facility(Park, Building), 
Group(floors, rooms), and finally Kiosk as a child marker.

The second one would use the Toronto Police Data Portal API for Major Crime 
Indicators. Parent markers would be police divisions of Greater Toronto Area, 
MCI(Major Crime Indicator) would be a group e.g. robbery, theft; and the 
crime itself will be the children markers.

I will start with static use with facilities and will expand to the Police API.
