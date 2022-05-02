import { useRoutes } from "react-router-dom";
import router from "./router";

const app = () => {
    const element = useRoutes(router);
    return (
        <>
            {element}
        </>
    )
};

export default app;
