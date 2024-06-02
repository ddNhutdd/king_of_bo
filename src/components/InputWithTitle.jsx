import React from 'react'

function InputWithTitle(props) {
	const {
		title,
		inputValue,
		inputOnChange,
		placeholder,
		children
	} = props

	return (
		<div className='input-width-title'>
			<div className='title'>
				{title}
			</div>
			<div className='input'>
				<input
					value={inputValue}
					onChange={inputOnChange}
					type="text"
					placeholder={placeholder}
				/>
			</div>
			<div className='button'>
				{children}
			</div>
		</div>
	)
}

export default InputWithTitle