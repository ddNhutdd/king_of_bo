import React, { useEffect, useRef } from 'react';
import addClass from '../function/addClass';
import { createPortal } from 'react-dom';

function ModalCustom(props) {
	const {
		animation = false,
		closeOnOverlay = false,
		show,
		closeModal,
		children,
		className,
		classNameContainer,
	} = props;

	// close modal inner
	const closeModalInner = () => {
		if (animation && modalRendering.current) return;
		closeModal();
	}

	// modal rendering khi có animation
	const modalRendering = useRef(false);

	const overlayElementRef = useRef(null);
	const modalContainerElementRef = useRef(null);
	const rootElementRef = useRef(null);

	useEffect(() => {
		const test = rootElementRef?.current || {};
		return () => {
			if (test) {
				test[`unmount`]?.();
			}
		}
	}, [])

	const removeClass = (ele, cla) => {
		if (ele) {
			ele?.classList?.remove(cla)
		}
	}

	useEffect(() => {
		if (!modalRendering.current) {
			if (show) {
				addClass(rootElementRef.current, "show");
				if (animation) {
					addClass(overlayElementRef.current, "overlayFadeIn");
					addClass(modalContainerElementRef.current, "modalConatinerFadeIn");
					modalRendering.current = true;

					const idtimeout = setTimeout(() => {
						modalRendering.current = false;
						clearTimeout(idtimeout);
					}, 400)
				}
			} else if (!show) {
				if (animation) {
					addClass(overlayElementRef.current, "overlayFadeOut");
					addClass(modalContainerElementRef.current, "modalContainerFadeOut");
					modalRendering.current = true;

					const idTimeout = setTimeout(() => {
						removeClass(rootElementRef?.current, "show");
						removeClass(overlayElementRef.current, "overlayFadeOut");
						removeClass(modalContainerElementRef.current, "modalContainerFadeOut")
						modalRendering.current = false;

						clearTimeout(idTimeout)
					}, 400);
				}
				else if (!animation) {
					removeClass(rootElementRef?.current, "show")
				}
			}
		}
	}, [show, animation])

	const renderOverlayClick = () => {
		return closeOnOverlay ? {
			onClick: closeModalInner
		} : {}
	}

	return (
		<>
			{
				createPortal(
					<>
						<div
							ref={rootElementRef}
							className='modal-custom'
						>
							<div
								ref={overlayElementRef}
								className={`overlay`}
								{...renderOverlayClick()}
							/>
							<div
								ref={modalContainerElementRef}
								className={`modal-container ${classNameContainer}`}
							>
								<div onClick={closeModalInner} className='close-button'>
									<i className="fa-solid fa-xmark" />
								</div>
								<div className={`modal ${className}`}>
									{children}
								</div>
							</div>
						</div>
					</>
					,
					document.getElementById("root") || document.createElement('div')
				)
			}
		</>
	)
}

export default ModalCustom;