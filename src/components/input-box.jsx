import './input-box.scss';

export default function InputBox({ invalid, ...props }) {
    if (invalid) return (
        <input className="inputBox invalid" {...props} />
    );

    return (
        <input className="inputBox" {...props} />
    );
}
