import { UserRegisterData } from "@/screens/Register/Register";

export type StackParamList = {
    HomeNav: undefined;
    Login: undefined;
    Register: undefined;
    UserDetail: UserRegisterData;
    SplashScreen: undefined;
    TambahLelang: undefined;
    DetailLelang: { id: string };
    Favourites: undefined;
  };