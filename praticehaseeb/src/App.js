import "bootstrap/dist/js/bootstrap.bundle"
import './App.scss';
import ScreenLoader from "./component/screenLoader"
import  Index  from "./pages/Routes";
import { useAuthContext } from "./context/AuthContext";


function App() {
  const { isAppLoading } = useAuthContext()
  return (
    <>
  {!isAppLoading
  ?    <Index/>
  :<ScreenLoader/>
  }
  
      </>
    
  );
}

export default App;
