FROM debian:11-slim

RUN apt update && \
    apt install -y cmake g++ git nodejs npm

RUN cd /home &&  \
    git clone https://github.com/oatpp/oatpp.git --depth=1 &&  \
    cd oatpp/ &&  \
    mkdir build &&  \
    cd build &&  \
    cmake .. &&  \
    make install && \
    cd /home &&  \
    git clone https://github.com/oglimmer/oatpp-swagger.git --depth=1 && \
    cd oatpp-swagger/ &&  \
    mkdir build &&  \
    cd build &&  \
    cmake .. &&  \
    make install

COPY . /home/blackjack

RUN cd /home/blackjack/client-res && \
    npm i && \
    npm run static


RUN cd /home/blackjack &&  \
    mkdir -p build &&  \
    cd build &&  \
    rm -rf * &&  \
    cmake .. &&  \
    make &&  \
    make test

FROM debian:11-slim

COPY --from=0 /home/blackjack/client-res/static /usr/local/client
COPY --from=0 /usr/local/include/oatpp-1.3.0/bin/oatpp-swagger/res /usr/local/include/oatpp-1.3.0/bin/oatpp-swagger/res
COPY --from=0 /home/blackjack/build/blackjack-exe /usr/bin

ENV STATIC_ROOT /usr/local/client/
CMD blackjack-exe
