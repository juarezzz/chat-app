import { loader } from '../../styles/Loading.module.css'

export default function Loading({ diameter, thickness, color = '#ffffffc6' }) {
    return (
        <div className={loader}
            style={{
                width: diameter,
                height: diameter,
                borderWidth: thickness,
                borderColor: color,
                borderBottomColor: 'transparent'
            }}
        />
    );
}