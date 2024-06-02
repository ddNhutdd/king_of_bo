import React, { useState } from 'react'

export const inputType = {
	pass: 'password',
	text: 'text'
}

function ProfileChangePassGroup(props) {
	const {
		label,
		type,
		error,
		id,
		name,
		onChange,
		value,
	} = props;

	// type của input
	const [inputTypeInner, setInputTypeInner] = useState(type);

	return (
		<div className='profile-change-pass-group'>
			<label>
				{label}
			</label>
			<div className='input-container'>
				<input
					id={id}
					type={inputTypeInner}
					name={name}
					onChange={onChange}
					value={value}
				/>
				{
					inputTypeInner === inputType.text &&
					type === inputType.pass &&
					<i
						className="fa-solid fa-eye"
						onClick={setInputTypeInner.bind(null, inputType.pass)}
					/>
				}
				{
					inputTypeInner === inputType.pass &&
					type === inputType.pass &&
					<i
						className="fa-solid fa-eye-slash"
						onClick={setInputTypeInner.bind(null, inputType.text)}
					/>
				}
			</div>
			{
				error && <div className='error'>
					{error}
				</div>
			}
		</div>
	)
}

export default ProfileChangePassGroup