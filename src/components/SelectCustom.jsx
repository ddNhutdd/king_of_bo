import React, { useEffect, useRef } from 'react';
import ReactDOM from "react-dom/client";

function SelectCustom(props) {
	const {
		options,
		onChange,
		menuClassCustom,
		children,
		forceRenderMenu
	} = props;

	const headerElementRef = useRef(document.createElement('div'));
	const menuElementRef = useRef(document.createElement('div'));

	const initial = () => {
		// tao menu
		const menu = document.createElement('div');
		menu.classList.add(`select-custom-menu`);
		if (menuClassCustom) {
			menu.classList.add(menuClassCustom);
		}
		menuElementRef.current = menu;
		calcPosition()

		// list item
		const listItem = options?.map(item => (
			<div
				key={item.key}
				className='item'
				onClick={itemClickHandle.bind(null, item)}
			>
				{item.content}
			</div>)
		)

		// render
		document.body.appendChild(menu)
		const menuRoot = ReactDOM.createRoot(menu);
		menuRoot.render(listItem)
	}
	const updateRef = useRef(initial);
	updateRef.current = initial;
	const initialRef = useRef(initial);
	const calcPosition = () => {
		if (
			!headerElementRef.current ||
			!menuElementRef.current
		) {
			return;
		}
		const rect = headerElementRef.current.getBoundingClientRect();
		const topPosition = rect.top - rect.height - rect.height + 5;
		const leftPosition = rect.left;

		// set positon menu
		menuElementRef.current.style.top = topPosition + 'px';
		menuElementRef.current.style.left = leftPosition + "px";
	}
	const itemClickHandle = (item) => {
		onChange(item);
	}
	const closeMenu = () => {
		menuElementRef.current.classList.remove('show');
	}
	const toggleMenu = (ev) => {
		ev.stopPropagation();
		menuElementRef.current.classList.toggle("show");
	}
	const closeAll = () => {
		closeMenu();
	}
	const closeAllRef = useRef(closeAll)

	useEffect(() => {
		initialRef.current();
		document.addEventListener('scroll', calcPosition);
		const closeAllCurrent = closeAllRef.current;
		document.addEventListener('click', closeAllCurrent);
		const resizeHandle = () => {
			closeMenu();
			calcPosition();
		}
		window.addEventListener('resize', resizeHandle)

		return () => {
			document.body.removeChild(menuElementRef.current);
			document.removeEventListener('scroll', calcPosition);
			document.removeEventListener('click', closeAllCurrent);
			window.removeEventListener('resize', resizeHandle)
		}
	}, [])
	useEffect(() => {
		document.body.removeChild(menuElementRef.current);
		updateRef.current();
	}, [forceRenderMenu])

	return (
		<div className='select-custom'>
			<div
				ref={headerElementRef}
				className='header'
				onClickCapture={toggleMenu}
			>
				{children}
			</div>
		</div>
	)
}

export default SelectCustom;