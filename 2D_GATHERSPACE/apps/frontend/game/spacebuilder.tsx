import React, { useEffect, useRef, useState } from 'react'
import { WebSocketManager } from './classes/websocketmanager'
import { MapManager } from './classes/mapmanager';
import Elementslist from './elementslist';
import axios from "axios"
import { SpaceManager } from './classes/spacemanager';
import { ElementSpriteManger } from './classes/elementspritemanager';

interface element {
    id: string,
    imageUrl: string,
    static: boolean,
    height: number,
    width: number
}

interface spaceElement {
    id: string,
    element: element
    x: number,
    y: number
}

interface spaceObject {
    dimensions: string,
    elements: spaceElement[]
}

const spacebuilder = () => {
    let spaceId
    const gameref = useRef<HTMLDivElement | null>(null)
    const game = useRef<Phaser.Game | null>(null)
    const sidebarref = useRef<HTMLDivElement | null>(null)
    const [spaceData, setspaceData] = useState<spaceObject | null>(null)
    const [webSocketStartKru, setwebsocketStartKru] = useState<string | null>(null)

    useEffect(() => {
        if (!webSocketStartKru) return

        const connectWebsocket = () => {
            const ws = new WebSocket("localhost:8000")

            ws.onopen = () => {
                console.log("websocket connection established");
                WebSocketManager.initialize(ws)
            }

            ws.onclose = () => {
                console.log("connection closed");
                setTimeout(connectWebsocket, 5000)

            }
        }

        connectWebsocket()

        return () => {
            WebSocketManager.getInstance()?.destroy()
        };
    }, [webSocketStartKru])

    useEffect(() => {
        const fetchElementsData = async (spaceid: string) => {
            const recievedData = await axios.get("some url")
            setspaceData(recievedData?.data)
            ElementSpriteManger.getInstance().elementList = recievedData?.data?.elements
            ElementSpriteManger.getInstance().dimensionX = recievedData?.data?.dimensions.split("x")[0]
            ElementSpriteManger.getInstance().dimensionY = recievedData?.data?.dimensions.split("x")[1]

        }
        fetchElementsData(spaceId)
    }, [])

    useEffect(() => {

        if (!gameref.current || !spaceData) return;
        const width = spaceData?.dimensions.split("x")[0]
        const height = spaceData?.dimensions.split("x")[1]
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width,
            height,
            parent: gameref.current, // Attach the game to the DOM element
            physics: {
                default: 'arcade', // Enable Arcade Physics
                arcade: {
                    gravity: { x: 0, y: 0 }, // Optional: Set gravity (if needed)
                    debug: true,       // Optional: Enable debug mode for visual debugging
                }
            },
            scene: new SpaceManager(), // Use your custom scene
        };

        // Create the Phaser game instance
        game.current = new Phaser.Game(config);
        setwebsocketStartKru("startkaro")

        // Cleanup function to destroy the game instance on component unmount
        return () => {
            game.current?.destroy(true);
            game.current = null;
        };
    }, [spaceData]);

    useEffect(() => {

        const handleClickEvent = (event: MouseEvent) => {
            if ((!gameref.current?.contains(event.target as Node)) && (!sidebarref.current?.contains(event.target as Node))) {
                console.log("clicked outside");
                if (MapManager.getInstance().getGhostElements()) {
                    MapManager.getInstance().clearSelectedElements()
                    MapManager.getInstance().clearGhostElements()
                }
            }
        }

        window.addEventListener("click", handleClickEvent)

        return () => {
            window.removeEventListener("click", handleClickEvent)
        }
    }, [])

    const selector = (e: any) => {
        console.log(e.key);

        MapManager.getInstance().setSelectedElements(e.id, e.static)




    }

    if (!spaceData) {
        return (
            <><div>loading</div></>
        )
    }

    return (
        <>
            <div ref={gameref} style={{ width: `${spaceData.dimensions.split("x")[0]}px`, height: `${spaceData.dimensions.split("x")[1]}px ` }}></div>
            <div ref={sidebarref} > {spaceData.elements.map((e) => (
                <div ><img onClick={() => selector(e.element)} src={e.element.imageUrl} alt="" /></div>
            ))} </div>
        </>
    )
}

export default spacebuilder







