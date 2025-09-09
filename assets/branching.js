// vgchat-branching-synthesized.js
// This is a synthesized, self-contained component for VGChat.
// It combines the best architectural patterns and features from multiple AI-generated outputs.
//
// - Core Architecture & Canvas Tree View from "Output 1" (The Production-Ready Blueprint).
// - Rewrite Mechanism from "Output 2" (The Clever Integrationist).

(function() {
    'use strict';

    // --- STATE MANAGEMENT ---
    const state = {
        conversationTree: new Map(), // messageId -> BranchNode instance
        messageElements: new Map(), // messageId -> DOM Element
        activeMenus: new Set(),
        treeViewOpen: false
    };

    class BranchNode {
        constructor(messageId, content, role, modelUsed, parentId = null) {
            this.id = messageId;
            this.role = role;
            this.parentId = parentId;
            this.children = []; // Array of child messageIds
            // A message can have multiple versions of itself
            this.versions = [{ content, model: modelUsed, timestamp: Date.now() }];
            this.currentVersionIndex = 0;
        }
    }

    const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // --- STYLES & DOM SETUP ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .message { position: relative; }
            .branch-trigger {
                position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
                width: 20px; height: 30px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; color: var(--vg-text-secondary); background: var(--vg-bg-primary);
                border: 1px solid var(--vg-border); border-left: none; border-radius: 0 6px 6px 0;
                transition: all 0.2s; font-size: 18px; z-index: 5;
            }
            .message.user .branch-trigger { right: auto; left: -20px; border-radius: 6px 0 0 6px; border-left: 1px solid var(--vg-border); border-right: none; }
            .branch-trigger:hover { color: var(--vg-primary); background: var(--vg-bg-secondary); }
            .branch-menu {
                position: absolute; right: calc(100% + 5px); top: 50%; transform: translateY(-50%);
                background: var(--vg-bg-primary); border: 1px solid var(--vg-border);
                border-radius: 8px; padding: 8px; display: flex; gap: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100;
            }
            .message.user .branch-menu { right: auto; left: calc(100% + 5px); }
            .branch-menu-btn {
                width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--vg-border);
                background: var(--vg-bg-primary); cursor: pointer; display: flex;
                align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s;
            }
            .branch-menu-btn:hover { background: var(--vg-primary); color: white; transform: scale(1.1); }
            .branch-navigator {
                display: inline-flex; align-items: center; gap: 8px; padding: 4px 8px;
                background: var(--vg-bg-secondary); border: 1px solid var(--vg-border);
                border-radius: 6px; font-size: 12px; color: var(--vg-text-secondary); margin-bottom: 8px;
            }
            .branch-nav-btn { background: none; border: none; cursor: pointer; padding: 2px 4px; color: var(--vg-primary); font-size: 14px; }
            .branch-nav-btn:disabled { opacity: 0.3; cursor: default; }
            .tree-view-overlay {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.9); z-index: 1000; display: flex; flex-direction: column;
            }
            .tree-view-header {
                padding: 20px; background: var(--vg-bg-secondary); border-bottom: 1px solid var(--vg-border);
                display: flex; justify-content: space-between; align-items: center;
            }
            #close-tree-btn {
                padding: 8px 16px; background: var(--vg-primary); color: white;
                border: none; border-radius: 6px; cursor: pointer;
            }
            .tree-view-canvas { flex: 1; width: 100%; cursor: grab; }
        `;
        document.head.appendChild(style);
    }

    // --- CORE LOGIC ---
    function initialize() {
        injectStyles();
        const messagesContainer = document.querySelector('#messages');
        if (!messagesContainer) {
            console.error('[Branching] #messages container not found.');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('message')) {
                        enhanceMessage(node, messagesContainer);
                    }
                });
            });
        });

        observer.observe(messagesContainer, { childList: true });

        // Process any messages already on the page
        messagesContainer.querySelectorAll('.message').forEach(node => enhanceMessage(node, messagesContainer));
        console.log('[Branching] Component Initialized.');
    }

    function enhanceMessage(messageEl, messagesContainer) {
        if (messageEl.dataset.branchId) return; // Already enhanced

        const messageId = generateId();
        messageEl.dataset.branchId = messageId;

        const { role, content, model } = extractMessageData(messageEl);
        const messages = Array.from(messagesContainer.querySelectorAll('.message'));
        const index = messages.indexOf(messageEl);
        const parentEl = index > 0 ? messages[index - 1] : null;
        const parentId = parentEl ? parentEl.dataset.branchId : null;

        const branchNode = new BranchNode(messageId, content, role, model, parentId);
        state.conversationTree.set(messageId, branchNode);
        state.messageElements.set(messageId, messageEl);

        if (parentId) {
            const parentNode = state.conversationTree.get(parentId);
            if (parentNode) {
                parentNode.children.push(messageId);
            }
        }

        createBranchControls(messageEl, messageId);
    }

    // --- UI CREATION & HANDLING ---
    function createBranchControls(messageEl, messageId) {
        const trigger = document.createElement('div');
        trigger.className = 'branch-trigger';
        trigger.innerHTML = '›';
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            showBranchMenu(messageEl, messageId);
        });
        messageEl.appendChild(trigger);
    }

    function showBranchMenu(messageEl, messageId) {
        document.querySelectorAll('.branch-menu').forEach(menu => menu.remove()); // Close others

        const menu = document.createElement('div');
        menu.className = 'branch-menu';

        const actions = [
            { icon: '🔄', title: 'Rewrite', action: () => handleRewrite(messageId) },
            { icon: '🎨', title: 'Rewrite with...', action: () => handleRewriteWith(messageId) },
            { icon: '🌳', title: 'View Tree', action: () => openTreeView() }
        ];

        actions.forEach(({ icon, title, action }) => {
            const btn = document.createElement('button');
            btn.className = 'branch-menu-btn';
            btn.title = title;
            btn.innerHTML = icon;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                action();
                menu.remove();
            });
            menu.appendChild(btn);
        });

        messageEl.appendChild(menu);

        // Click-away to close
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 0);
    }
    
    function createOrUpdateNavigator(messageEl, messageId) {
        const node = state.conversationTree.get(messageId);
        if (!node || !node.parentId) return;

        const parentNode = state.conversationTree.get(node.parentId);
        if (!parentNode || parentNode.children.length <= 1) {
            messageEl.querySelector('.branch-navigator')?.remove(); // Clean up if only one version remains
            return;
        }

        let navigator = messageEl.querySelector('.branch-navigator');
        if (!navigator) {
            navigator = document.createElement('div');
            navigator.className = 'branch-navigator';
            messageEl.insertBefore(navigator, messageEl.firstChild);
        }

        const currentIndex = parentNode.children.indexOf(messageId);
        navigator.innerHTML = `
            <button class="branch-nav-btn prev" ${currentIndex === 0 ? 'disabled' : ''}>◀</button>
            <span>v${currentIndex + 1} of ${parentNode.children.length}</span>
            <button class="branch-nav-btn next" ${currentIndex === parentNode.children.length - 1 ? 'disabled' : ''}>▶</button>
        `;

        navigator.querySelector('.prev:not([disabled])')?.addEventListener('click', () => {
            switchToBranch(parentNode.children[currentIndex - 1]);
        });
        navigator.querySelector('.next:not([disabled])')?.addEventListener('click', () => {
            switchToBranch(parentNode.children[currentIndex + 1]);
        });
    }

    // --- FUNCTIONALITY & ACTIONS ---
    function handleRewrite(messageId) {
        const node = state.conversationTree.get(messageId);
        if (!node || !node.parentId) return;

        const parentNode = state.conversationTree.get(node.parentId);
        if (!parentNode) return;

        // "UI Hijack" Method
        const promptText = parentNode.versions[parentNode.currentVersionIndex].content;
        _triggerRewriteWithPrompt(promptText);
    }

    function handleRewriteWith(messageId) {
        // In a full implementation, this would open a model selector UI.
        // For now, it will just demonstrate the principle.
        alert("Imagine a model selector has opened. The rewrite will now proceed with the selected model.");
        handleRewrite(messageId);
    }
    
    function _triggerRewriteWithPrompt(promptText) {
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send');
        if (userInput && sendBtn) {
            userInput.value = promptText;
            userInput.dispatchEvent(new Event('input', { bubbles: true })); // For auto-resizers
            sendBtn.click();
        } else {
            console.error('[Branching] Cannot find #user-input or #send button to trigger rewrite.');
        }
    }

    function switchToBranch(targetMessageId) {
        const targetNode = state.conversationTree.get(targetMessageId);
        if (!targetNode || !targetNode.parentId) return;

        const parentNode = state.conversationTree.get(targetNode.parentId);
        const parentEl = state.messageElements.get(targetNode.parentId);
        if (!parentNode || !parentEl) return;
        
        // Find the element representing the current branch at this level
        const oldMessageId = parentNode.children[parentNode.currentVersionIndex];
        const messageEl = state.messageElements.get(oldMessageId);
        if (!messageEl) return;

        // Update parent state
        parentNode.currentVersionIndex = parentNode.children.indexOf(targetMessageId);
        
        // Update the visible message's content and ID
        messageEl.dataset.branchId = targetNode.id;
        state.messageElements.set(targetNode.id, messageEl); // Point new ID to existing element
        state.messageElements.delete(oldMessageId); // Remove old ID mapping

        const { content, model } = targetNode.versions[0];
        messageEl.querySelector('.content').textContent = content;
        const modelEl = messageEl.querySelector('.meta')?.textContent.split('·')[0]; // Simple update
        if(modelEl) messageEl.querySelector('.meta').textContent = `${modelEl} · ${model}`;
        
        // Refresh the navigator on the parent element
        createOrUpdateNavigator(parentEl, parentNode.id);

        updateDownstreamMessages(messageEl, targetNode);
    }

    function updateDownstreamMessages(changedMessageEl, newStartNode) {
        const messages = document.querySelectorAll('#messages .message');
        const messageArray = Array.from(messages);
        const changedIndex = messageArray.indexOf(changedMessageEl);

        if (changedIndex === -1) return;

        let currentNode = newStartNode;
        // Update or hide all subsequent messages
        for (let i = changedIndex + 1; i < messageArray.length; i++) {
            const messageElToUpdate = messageArray[i];
            const nextChildId = currentNode.children.length > 0 ? currentNode.children[currentNode.currentVersionIndex] : null;
            
            if (nextChildId) {
                const nextNode = state.conversationTree.get(nextChildId);
                messageElToUpdate.style.display = '';
                // Update its content, ID, etc.
                const { content, model } = nextNode.versions[0];
                messageElToUpdate.querySelector('.content').textContent = content;
                 const modelEl = messageElToUpdate.querySelector('.meta')?.textContent.split('·')[0];
                 if(modelEl) messageElToUpdate.querySelector('.meta').textContent = `${modelEl} · ${model}`;
                messageElToUpdate.dataset.branchId = nextNode.id;
                state.messageElements.set(nextNode.id, messageElToUpdate);
                createOrUpdateNavigator(messageElToUpdate, nextNode.id);
                currentNode = nextNode;
            } else {
                // This branch is shorter, hide the rest
                messageElToUpdate.style.display = 'none';
            }
        }
    }


    // --- UTILITY & DATA EXTRACTION ---
    function extractMessageData(messageEl) {
        const role = messageEl.classList.contains('user') ? 'user' : 'assistant';
        const content = messageEl.querySelector('.content')?.textContent || '';
        const metaText = messageEl.querySelector('.meta')?.textContent || '';
        const model = metaText.split('·')[1]?.trim() || 'Unknown';
        return { role, content, model };
    }

    // --- TREE VISUALIZATION (from Output 1) ---
    function openTreeView() {
        if (state.treeViewOpen) return;
        state.treeViewOpen = true;

        const overlay = document.createElement('div');
        overlay.className = 'tree-view-overlay';
        overlay.innerHTML = `
            <div class="tree-view-header">
                <h2 style="margin: 0; color: var(--vg-text-primary);">Conversation Tree</h2>
                <button id="close-tree-btn">Close</button>
            </div>
            <canvas class="tree-view-canvas"></canvas>
        `;
        document.body.appendChild(overlay);

        const canvas = overlay.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 80; // Account for header

        let viewOffset = { x: canvas.width / 2, y: 50 };
        let zoom = 1;
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        const nodePositions = new Map();
        const nodeRadius = 20;
        const levelHeight = 100;

        function calculatePositions() {
            nodePositions.clear();
            const roots = Array.from(state.conversationTree.values()).filter(n => !n.parentId);
            let yOffset = 0;
            roots.forEach(root => {
                const { height } = positionSubtree(root, 0, yOffset, canvas.width);
                yOffset += height + levelHeight;
            });
        }
        
        function positionSubtree(node, x, y, availableWidth) {
            nodePositions.set(node.id, { x, y });
            let subtreeHeight = levelHeight;
            if (node.children.length > 0) {
                const childWidth = availableWidth / node.children.length;
                let maxHeight = 0;
                node.children.forEach((childId, index) => {
                    const child = state.conversationTree.get(childId);
                    if (child) {
                        const startX = x - (availableWidth / 2) + (childWidth / 2);
                        const {height} = positionSubtree(child, startX + (index * childWidth), y + levelHeight, childWidth);
                        maxHeight = Math.max(maxHeight, height);
                    }
                });
                subtreeHeight += maxHeight;
            }
            return {height: subtreeHeight};
        }

        function drawTree() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(viewOffset.x, viewOffset.y);
            ctx.scale(zoom, zoom);
            
            // Draw edges
            ctx.strokeStyle = 'var(--vg-text-secondary)';
            ctx.lineWidth = 1.5;
            state.conversationTree.forEach(node => {
                if(node.children.length > 0){
                    const parentPos = nodePositions.get(node.id);
                    if(!parentPos) return;
                    node.children.forEach(childId => {
                        const childPos = nodePositions.get(childId);
                        if(!childPos) return;
                        ctx.beginPath();
                        ctx.moveTo(parentPos.x, parentPos.y);
                        ctx.lineTo(childPos.x, childPos.y);
                        ctx.stroke();
                    });
                }
            });

            // Draw nodes
            state.conversationTree.forEach(node => {
                const pos = nodePositions.get(node.id);
                if (!pos) return;

                ctx.beginPath();
                ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
                ctx.fillStyle = node.role === 'user' ? 'var(--vg-primary)' : 'var(--vg-secondary)';
                ctx.fill();
                ctx.strokeStyle = 'var(--vg-border)';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = 'white';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const label = node.versions[0].content.substring(0, 10) + '...';
                ctx.fillText(label, pos.x, pos.y);
            });
            ctx.restore();
        }

        calculatePositions();
        drawTree();

        // Event Listeners for pan/zoom/click
        canvas.addEventListener('mousedown', e => { isDragging = true; dragStart = { x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y }; canvas.style.cursor = 'grabbing'; });
        canvas.addEventListener('mouseup', () => { isDragging = false; canvas.style.cursor = 'grab'; });
        canvas.addEventListener('mousemove', e => { if (isDragging) { viewOffset.x = e.clientX - dragStart.x; viewOffset.y = e.clientY - dragStart.y; drawTree(); } });
        canvas.addEventListener('wheel', e => { e.preventDefault(); const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1; zoom = Math.max(0.2, Math.min(zoom * scaleFactor, 3)); drawTree(); });
        overlay.querySelector('#close-tree-btn').addEventListener('click', () => { overlay.remove(); state.treeViewOpen = false; });
    }

    // --- INITIALIZATION ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();