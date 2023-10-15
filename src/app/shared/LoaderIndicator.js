import { usePromiseTracker } from "react-promise-tracker";
import { TailSpin } from 'react-loader-spinner';
import LoadingOverlay from "react-loading-overlay";
LoadingOverlay.propTypes = undefined

export const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker();
    return (promiseInProgress &&
        <div>
            <LoadingOverlay
                active={true}
                spinner={<TailSpin color="#5b47fb" />}
            ></LoadingOverlay>
        </div>
    );
}