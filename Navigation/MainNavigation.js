import {createStackNavigator} from '@react-navigation/stack';
import {Routes} from './Routes';
import Login from '../screens/Login/Login';
import EnterOtp from '../screens/EnterOtp/EnterOtp';
import PersonalDetails from '../screens/PersonalDetails/PersonalDetails';
import VehicleDetails from '../screens/VehicleDetails/VehicleDetails';
import Home from '../screens/Home/Home';
import Menu from '../screens/Menu/Menu';
import {useAuth} from '../context/AuthContext';
import Services from '../screens/Services/Services';
import LocationSearch from '../screens/NearbyLocator/LocationSearch/LocationSearch';
import NearbyCenters from '../screens/NearbyLocator/NearbyCenters/NearbyCenters';
import CenterDetails from '../screens/NearbyLocator/CenterDetails/CenterDetails';
import SelectService from '../screens/ScheduleService/SelectService/SelectService';
import SelectVehicle from '../screens/ScheduleService/SelectVehicle/SelectVehicle';
import SelectAddress from '../screens/ScheduleService/SelectAddress/SelectAddress';
import SelectSlot from '../screens/ScheduleService/SelectSlot/SelectSlot';
import Checkout from '../screens/ScheduleService/Checkout/Checkout';
import ESSelectVehicle from '../screens/EmergencyService/ESSelectVehicle/ESSelectVehicle';
import ESSelectService from '../screens/EmergencyService/ESSelectService/ESSelectService';
import ESSelectAddress from '../screens/EmergencyService/ESSelectAddress/ESSelectAddress';
import MyVehicle from '../screens/MyVehicle/MyVehicle';
import Eco from '../screens/Eco/Eco';
import MileageCalculator from '../screens/MileageCalculator/MileageCalculator';
import FuelTracker from '../screens/FuelTracker/FuelTracker';
import MechanicDetails from '../MechanicScreens/MechanicDetails/MechanicDetails';
import UploadImage from '../MechanicScreens/UploadImage/UploadImage';
import StatusLoading from '../MechanicScreens/StatusLoading/StatusLoading';
import MechanicHome from '../MechanicScreens/MechanicHome/MechanicHome';
import MechanicBooking from '../MechanicScreens/MechanicBooking/MechanicBooking';
import MechanicMenu from '../MechanicScreens/MechanicMenu/MechanicMenu';
import MechanicPreference from '../MechanicScreens/MechanicPreference/MechanicPreference';
import Earnings from '../MechanicScreens/Earnings/Earnings';
import Review from '../MechanicScreens/Review/Review';
import AdminDashboard from '../AdminScreens/AdminDashboard/AdminDashboard';
import AdminMechanicApproval from '../AdminScreens/AdminMechanicApproval/AdminMechanicApproval';
import ActiveMechanics from '../AdminScreens/ActiveMechanics/ActiveMechanics';
import AdminBookings from '../AdminScreens/AdminBookings/AdminBookings';
import AdminProfile from '../AdminScreens/AdminProfile/AdminProfile';
import {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import BookingConfirmed from '../screens/ScheduleService/BookingConfirmed/BookingConfirmed';
import BookingHistory from '../screens/BookingHistory/BookingHistory';
import Rewards from '../screens/Rewards/Rewards';
import MechanicFound from '../screens/EmergencyService/MechanicFound/MechanicFound';
import SearchingMechanic from '../screens/EmergencyService/SearchingMechanic/SearchingMechanic';
import OngoingBookings from '../components/OngoingBookings/OngoingBookings';
import BookingDetails from '../screens/BookingDetails/BookingDetails';
import AdminServiceCenters from '../AdminScreens/AdminServiceCenters/AdminServiceCenters';
import OrderHistory from '../MechanicScreens/OrderHistory/OrderHistory';
import OrderDetails from '../MechanicScreens/OrderDetails/OrderDetails';

const Stack = createStackNavigator();

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const MainNavigation = () => {
  const { idToken, isNewUser, role, loading } = useAuth(); // Get token from context
  const [isReady, setIsReady] = useState(false); // ✅ Wait for role to be set
  const [initialRoute, setInitialRoute] = useState(null);
  useEffect(() => {
    if (!loading) {
      let route = Routes.Login;
      if (!idToken) {
        setInitialRoute(Routes.Login);
      } else if (isNewUser) {
        if (role === 'Mechanic') {
          setInitialRoute(Routes.MechanicDetails); // Mechanic-specific page
        }
        else{setInitialRoute(Routes.PersonalDetails);}
      } else if (role === 'Admin') {
        setInitialRoute(Routes.AdminDashboard);
      } else if (role === 'Mechanic') {
        setInitialRoute(Routes.MechanicHome);
      } else if (role === 'User') {
        setInitialRoute(Routes.Home);
        } else {
          // setInitialRoute(Routes.Home);
        }
    }
  }, [idToken, isNewUser, role, loading]);

  if (loading || !initialRoute) {
    return <SplashScreen />;
  }

  // const getInitialRoute = () => {
  //     if (!idToken) return Routes.Login;
  //     if (isNewUser) return Routes.PersonalDetails;
  //     if (role === 'Admin') return Routes.AdminDashboard;
  //     if (role === 'Mechanic') return Routes.MechanicHome;
  //     return Routes.Home;
  // };

  const GuestStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Login} component={Login} />
      <Stack.Screen name={Routes.EnterOtp} component={EnterOtp} />
    </Stack.Navigator>
  );

  const UserStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Home} component={Home} />
      <Stack.Screen name={Routes.PersonalDetails} component={PersonalDetails} />
      <Stack.Screen name={Routes.VehicleDetails} component={VehicleDetails} />
      <Stack.Screen name={Routes.Menu} component={Menu} />
      <Stack.Screen name={Routes.Services} component={Services} />
      <Stack.Screen name={Routes.LocationSearch} component={LocationSearch} />
      <Stack.Screen name={Routes.NearbyCenters} component={NearbyCenters} />
      <Stack.Screen name={Routes.CenterDetails} component={CenterDetails} />
      <Stack.Screen name={Routes.SelectService} component={SelectService} />
      <Stack.Screen name={Routes.SelectVehicle} component={SelectVehicle} />
      <Stack.Screen name={Routes.SelectAddress} component={SelectAddress} />
      <Stack.Screen name={Routes.SelectSlot} component={SelectSlot} />
      <Stack.Screen name={Routes.Checkout} component={Checkout} />
      <Stack.Screen name={Routes.ESSelectVehicle} component={ESSelectVehicle} />
      <Stack.Screen name={Routes.ESSelectService} component={ESSelectService} />
      <Stack.Screen name={Routes.ESSelectAddress} component={ESSelectAddress} />
      <Stack.Screen name={Routes.MyVehicle} component={MyVehicle} />
      <Stack.Screen name={Routes.Eco} component={Eco} />
      <Stack.Screen name={Routes.MileageCalculator} component={MileageCalculator} />
      <Stack.Screen name={Routes.FuelTracker} component={FuelTracker} />
      <Stack.Screen name={Routes.BookingConfirmed} component={BookingConfirmed} />
      <Stack.Screen name={Routes.BookingHistory} component={BookingHistory} />
      <Stack.Screen name={Routes.Rewards} component={Rewards} />
      <Stack.Screen name={Routes.SearchingMechanic} component={SearchingMechanic} />
      <Stack.Screen name={Routes.MechanicFound} component={MechanicFound} />
      <Stack.Screen name={Routes.OngoingBookings} component={OngoingBookings} />
      <Stack.Screen name={Routes.BookingDetails} component={BookingDetails} />
      <Stack.Screen name={Routes.Review} component={Review} />

    </Stack.Navigator>
  );

  const MechanicStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.MechanicHome} component={MechanicHome} />
      <Stack.Screen name={Routes.MechanicDetails} component={MechanicDetails} />
      <Stack.Screen name={Routes.UpLoadImage} component={UploadImage} />
      <Stack.Screen name={Routes.StatusLoading} component={StatusLoading} />
      <Stack.Screen name={Routes.MechanicBooking} component={MechanicBooking} />
      <Stack.Screen name={Routes.MechanicMenu} component={MechanicMenu} />
      <Stack.Screen name={Routes.MechanicPreference} component={MechanicPreference} />
      <Stack.Screen name={Routes.Earnings} component={Earnings} />
      <Stack.Screen name={Routes.Review} component={Review} />
      <Stack.Screen name={Routes.OrderHistory} component={OrderHistory} />
      <Stack.Screen name={Routes.OrderDetails} component={OrderDetails} />
    </Stack.Navigator>
  );

  const AdminStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.AdminDashboard} component={AdminDashboard} />
      <Stack.Screen name={Routes.AdminMechanicApproval} component={AdminMechanicApproval} />
      <Stack.Screen name={Routes.ActiveMechanics} component={ActiveMechanics} />
      <Stack.Screen name={Routes.AdminBookings} component={AdminBookings} />
      <Stack.Screen name={Routes.AdminProfile} component={AdminProfile} />
      <Stack.Screen name={Routes.AdminServiceCenters} component={AdminServiceCenters} />
    </Stack.Navigator>
  );

  const NewUserStack = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.PersonalDetails} component={PersonalDetails} />
      <Stack.Screen name={Routes.VehicleDetails} component={VehicleDetails} />
      <Stack.Screen name={Routes.Home} component={Home} />
      <Stack.Screen name={Routes.Menu} component={Menu} />
      <Stack.Screen name={Routes.Services} component={Services} />
      <Stack.Screen name={Routes.LocationSearch} component={LocationSearch} />
      <Stack.Screen name={Routes.NearbyCenters} component={NearbyCenters} />
      <Stack.Screen name={Routes.CenterDetails} component={CenterDetails} />
      <Stack.Screen name={Routes.SelectService} component={SelectService} />
      <Stack.Screen name={Routes.SelectVehicle} component={SelectVehicle} />
      <Stack.Screen name={Routes.SelectAddress} component={SelectAddress} />
      <Stack.Screen name={Routes.SelectSlot} component={SelectSlot} />
      <Stack.Screen name={Routes.Checkout} component={Checkout} />
      <Stack.Screen name={Routes.ESSelectVehicle} component={ESSelectVehicle} />
      <Stack.Screen name={Routes.ESSelectService} component={ESSelectService} />
      <Stack.Screen name={Routes.ESSelectAddress} component={ESSelectAddress} />
      <Stack.Screen name={Routes.MyVehicle} component={MyVehicle} />
      <Stack.Screen name={Routes.Eco} component={Eco} />
      <Stack.Screen name={Routes.MileageCalculator} component={MileageCalculator} />
      <Stack.Screen name={Routes.FuelTracker} component={FuelTracker} />
    </Stack.Navigator>
  );


  return (
    <>
      {initialRoute === Routes.Login && <GuestStack />}
      {initialRoute === Routes.PersonalDetails && <NewUserStack />}
      {initialRoute === Routes.Home && <UserStack />}
      {initialRoute === Routes.MechanicHome && <MechanicStack />}
      {initialRoute === Routes.AdminDashboard && <AdminStack />}
    </>
  );
};

export default MainNavigation;

