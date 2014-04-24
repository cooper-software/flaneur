INTERVAL = {
    'seconds': 1
}

counter = 0


def run(emit):
    counter++
    emit('counter', counter)