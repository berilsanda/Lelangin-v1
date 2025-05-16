import { UserRegisterData } from "@/screens/Auth/Register/Register";

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