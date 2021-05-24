function isAriaHidden(element){
    if (element.getAttribute('aria-hidden') === 'true'){
        return true;
    }
    if (element.parentElement !== null) {
        return isAriaHidden(element.parentElement);
    } else {
        // We reached the top of the
        return false;
    }
}

const directResults = Array.from(document.querySelectorAll('#rso .g'));

// First we filter out stuff that has too much syntax
let results = directResults.filter((element) => element.classList.length === 1);
// Filter out aria-hidden elements, so we don't get e.g. "people also ask" accordion questions
results = results.filter(el => !isAriaHidden(el));

console.log(results);

let currentlySelectedResult = 0;

function changeFocus(previousElement, currentElement) {
    if (previousElement) {
        previousElement.style.border = '';
    }
    currentElement.style.border = '1px black dashed';
    currentElement.scrollIntoView({block: 'center'});

    Array.from(currentElement.querySelectorAll('a')).find(el => el.innerHTML.includes('h3')).focus();

    //todo scroll into focus
}

function changeCurrentResult(down) {
    let previousSelection = results[currentlySelectedResult];
    // if up
    if (!down) {
        console.log('up');
        if (currentlySelectedResult === 0) {
            // can't go further up than that
            return;
        }
        currentlySelectedResult--;
    }
    // if down
    else {
        console.log('down', currentlySelectedResult);
        if (currentlySelectedResult + 1 === results.length) {
            console.log("Bottom reached, do nothing");
            return;
        }
        currentlySelectedResult++;
    }

    console.log({ currentlySelectedResult });

    changeFocus(previousSelection, results[currentlySelectedResult]);

}

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode === '38') {
        //up
        console.log('up arrow');
        changeCurrentResult(false)
        e.preventDefault();
    }
    else if (e.keyCode === '40') {
        // down arrow
        console.log('down arrow');
        changeCurrentResult(true);
        e.preventDefault();
    }

}

document.onkeydown = checkKey;

// Focus initial element on load
changeFocus(undefined, results[0]);
