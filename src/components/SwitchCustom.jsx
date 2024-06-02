import React from 'react'

function SwitchCustom(props) {
	const {
		checked = false,
		onClick = () => { },
		loading = false
	} = props;

	const classActive = checked ? 'active' : '';

	return (
		<div
			className={`switch-custom ${classActive}`}
			onClick={onClick}
		>
			<div className={`on`}>On</div>
			<div className={`off`}>Off</div>
			<div className={`ball`}>
				{
					loading && <div className='loading' />
				}
			</div>
		</div>
	)
}

export default SwitchCustom