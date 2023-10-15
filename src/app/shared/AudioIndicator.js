import { Audio } from 'react-loader-spinner';
import LoadingOverlay from "react-loading-overlay";
LoadingOverlay.propTypes = undefined

export const AudioIndicator = (props) => {
    if (props.speaking) {
        return (
            <div>
                <LoadingOverlay
                    active={true}
                    spinner={<Audio color="#5b47fb" />}
                ></LoadingOverlay>
            </div>
        );
    } else{ 
        return <div></div>
    }
}